
import { grammars } from './grammar.json'
import table from './table.json'
import { lexer, Token } from './lexer'
import { DiceNode, resolve } from '../ast'

export interface Producer {
  id: number
  name: string
  tokens: string[]
}

export type BufferElement = Token | DiceNode

enum ActionType {
  shift, reduce, goto
}

interface Action {
  t: ActionType // type
  d: string     // target
}

const producers: Record<string, Producer> = {}

Object.values(grammars).flat()
  .forEach(producer => producers[producer.id] = producer)

export function parse(input: string) {
  const next = lexer(input)
  const stack = ['1']
  const buffer: BufferElement[] = []
  let token: Token
  while (true) {
    if (!token) token = next()
    const state = stack[stack.length - 1]
    const action: Action = table[state][token.type === 'number' ? 'num' : token.value]
    if (!action) throw new Error('parsing error')
    switch (action.t) {
      case ActionType.shift:
        stack.push(action.d)
        buffer.push(token)
        token = null
        break
      case ActionType.reduce:
        const id = action.d
        const producer = producers[id]
        const { name, tokens } = producer
        const nodes: BufferElement[] = []
        if (tokens[0] !== 'empty') {
          tokens.forEach(_ => {
            nodes.unshift(buffer.pop())
            stack.pop()
          })
        }
        buffer.push(resolve(producer, nodes))
        if (name === 'G') {
          return buffer.pop()
        }
        const next: Action = table[stack[stack.length - 1]][name]
        if (!next) throw new Error('parsing error')
        stack.push(next.d)
        break
    }
  }
}