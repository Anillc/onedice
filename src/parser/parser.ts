
import { grammars } from './grammar.json'
import table from './table.json'
import { lexer, Token } from './lexer'
import { DiceNode, resolve } from '../ast'

export interface Producer {
  id: string
  name: string
  tokens: string[]
}

export type BufferElement = Token | DiceNode

interface Action {
  type: 'shift' | 'reduce' | 'goto'
  target: string
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
    switch (action.type) {
      case 'shift':
        stack.push(action.target)
        buffer.push(token)
        token = null
        break
      case 'reduce':
        const id = action.target
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
        stack.push(next.target)
        break
    }
  }
}