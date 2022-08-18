import { load } from 'js-yaml'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import uniqWith from 'lodash.uniqwith'
import groupBy from 'lodash.groupby'

interface Producer {
  id: string
  name: string
  tokens: string[]
}

interface Item {
  producer: Producer
  position: number
  forward: string
}

interface Itemset {
  id: number
  items: Item[]
  next: Record<string, number>
}

const g = load(readFileSync(resolve(__dirname, './grammar.yaml'), 'utf-8')) as any

let terms: string[]
const grammars: Record<string, Producer[]> = {}

for (const [key, value] of Object.entries(g)) {
  if (key === 'term') {
    terms = (value as string).split(' ').concat('$')
    continue
  }
  const producers: string[] = Array.isArray(value) ? value : [value]
  grammars[key] = producers.map(producer => {
    const [id, ...tokens] = producer.split(/\s+/)
    return { name: key, id, tokens }
  })
}

function itemEqual(a: Item, b: Item) {
  return a.producer.id === b.producer.id && a.position === b.position && a.forward === b.forward
}

function itemsEqual(a: Item[], b: Item[]) {
  if (a.length !== b.length) return false
  a.sort((a, b) => Number(
    `${a.producer.id}${a.position}${a.forward}` > `${b.producer.id}${b.position}${b.forward}`))
  for (let i = 0; i < a.length; i++) {
    if (!itemEqual(a[i], b[i])) return false
  }
  return true
}

function first(query: string[], stack: string[] = []): Set<string> {
  const result = new Set<string>()
  if (query.length === 0) {
    result.add('empty')
    return result
  }
  if (terms.includes(query[0])) {
    result.add(query[0])
    return result
  }
  const producers = grammars[query[0]]

  for (const { tokens } of producers) {
    for (const token of tokens) {
      if (token === 'empty') {
        result.add('empty')
        break
      } else if (terms.includes(token)) {
        result.add(token)
        break
      } else {
        if (stack.includes(token)) break
        stack.push(token)
        const sub = first([token], stack)
        sub.forEach(e => result.add(e))
        stack.pop()
        if (!sub.has('empty')) break
      }
    }
  }

  if (result.has('empty')) {
    query.shift()
    const next = first(query, stack)
    next.forEach(e => result.add(e))
    if (!next.has('empty')) result.delete('empty')
  }
  return result
}

function closure(items: Item[]) {
  while (true) {
    const oldItems = [...items]
    for (const item of oldItems) {
      const { position, forward, producer } = item
      const { tokens } = producer
      if (position === tokens.length) continue
      const token = tokens[position]
      if (terms.includes(token) || token === 'empty') continue
      const rest = [...tokens.slice(position + 1), forward]
      grammars[token].forEach(newProducer => {
        first(rest).forEach(e => items.push({
          producer: newProducer,
          position: 0,
          forward: e
        }))
      })
    }
    const uniqItems = uniqWith(items, itemEqual)
    items.splice(0)
    items.push(...uniqItems)
    if (items.length === oldItems.length) break
  }
}

function cluster() {
  const itemsets: Itemset[] = [{
    id: 1,
    next: {},
    items: [{
      producer: grammars['G'][0],
      position: 0,
      forward: '$',
    }],
  }]
  closure(itemsets[0].items)
  for (let i = 0; i < itemsets.length; i++) {
    const itemset = itemsets[i]
    const nexts = itemset.items
      .filter(item => item.position < item.producer.tokens.length)
      .filter(item => item.producer.tokens[0] !== 'empty')
    const nextItemsets = groupBy(nexts, item => item.producer.tokens[item.position])
    for (const [key, value] of Object.entries(nextItemsets)) {
      const nextItemset: Item[] = value.map(e => ({
        ...e,
        position: e.position + 1,
      }))
      closure(nextItemset)
      const origin = itemsets.find(e => itemsEqual(e.items, nextItemset))
      if (origin) {
        itemset.next[key] = origin.id
      } else {
        const id = itemsets.length + 1
        itemsets.push({
          id: id,
          next: {},
          items: nextItemset,
        })
        itemset.next[key] = id
      }
    }
  }
  return itemsets
}

type Action = {
  type: 'shift' | 'goto'
  target: number
} | {
  type: 'reduce'
  target: string
}


function actionEqual(a: Action, b: Action) {
  if (a === b) return true
  return a.type === b.type && a.target === b.target
}

const clst = cluster()

const action: Record<string, Record<string, Action>> = {}

function getOrCreate(state: number): Record<string, Action> {
  let record = action[String(state)]
  if (!record) {
    record = {}
    action[state] = record
  }
  return record
}

clst.forEach(itemset => {
  const states = getOrCreate(itemset.id)
  itemset.items.forEach(item => {
    if (item.position === item.producer.tokens.length) {
      const origin = states[item.forward]
      const action: Action = {
        type: 'reduce',
        target: item.producer.id
      }
      if (!origin) {
        states[item.forward] = action
        return
      }
      if (!actionEqual(origin, action)) throw 'conflict'
    } else {
      const token = item.producer.tokens[item.position]
      const target = itemset.next[token]
      const origin = states[token]
      const action: Action = terms.includes(token)
        ? { type: 'shift', target }
        : { type: 'goto', target }
      if (!origin) {
        states[token] = action
        return
      }
      if (!actionEqual(origin, action)) throw 'conflict'
    }
  })
})

writeFileSync(resolve(__dirname, '../src/grammar.json') ,JSON.stringify(grammars))
writeFileSync(resolve(__dirname, '../src/table.json') ,JSON.stringify(action))