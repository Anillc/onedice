import { grammars } from './grammar.json'
import table from './table.json'
import { lexer, Token } from './lexer'

export interface Producer {
  id: string
  name: string
  tokens: string[]
}

export type Node = {
  type: 'token'
  value: Token
} | {
  type: 'ast'
  producer: Producer
  value: Node[]
}

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
  const buffer: Node[] = []
  let token: Token
  while (true) {
    if (!token) token = next()
    const state = stack[stack.length - 1]
    const action: Action = table[state][token.type === 'number' ? 'num' : token.value]
    if (!action) throw new Error('parsing error')
    switch (action.type) {
      case 'shift':
        stack.push(action.target)
        buffer.push({ type: 'token', value: token })
        token = null
        break
      case 'reduce':
        const id = action.target
        const producer = producers[id]
        const { name, tokens } = producer
        const nodes: Node[] = []
        if (tokens[0] !== 'empty') {
          tokens.forEach(_ => {
            nodes.unshift(buffer.pop())
            stack.pop()
          })
        }
        buffer.push({ type: 'ast', value: nodes, producer })
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