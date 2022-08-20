import { Producer, BufferElement, Token } from '../parser'
import { BracketNode } from './bracket'
import { ANode } from './dice/a'
import { CNode } from './dice/c'
import { DNode } from './dice/d'
import { FNode } from './dice/f'
import { PNode } from './dice/p'
import { NumberNode } from './number'
import { SimpleNode } from './simple'

export * from './bracket'
export * from './simple'
export * from './number'
export * from './dice/d'
export * from './dice/p'
export * from './dice/a'
export * from './dice/c'
export * from './dice/f'

export interface Env {
  d?: {
    a?: number
    b?: number
    c?: number
    d?: number
    e?: number
  }
  p?: {
    a?: number
    b?: number
  }
  a?: {
    a?: number
    b?: number
    c?: number
    d?: number
    e?: number
  }
  c?: {
    a?: number
    b?: number
    c?: number
  }
  f?: {
    a?: number
    b?: number
  }
}

export type Flow = [string, number]

export interface DiceNode {
  eval(env: Env, flow: Flow[]): number
}

interface Options extends DiceNode {
  options: Record<string, DiceNode>
}

export function resolve(producer: Producer, nodes: BufferElement[]): DiceNode {
  switch (producer.id) {
    case '1g': {
      return nodes[0] as DiceNode
    }
    case '2add':
    case '3sub':
    case '5mul1':
    case '6mul2':
    case '7div':
    case '9power': {
      const operator = (nodes[1] as Token).value as string
      const left = nodes[0] as DiceNode
      const right = nodes[2] as DiceNode
      return new SimpleNode(operator, left, right)
    }
    case '4elem':
    case '8elem':
    case '10elem':
    case '16elem': {
      return nodes[0] as DiceNode
    }
    case '11d':
    case '12p':
    case '13a':
    case '14c':
    case '15f': {
      return nodes[0] as DiceNode
    }
    case '17brac': {
      return new BracketNode(nodes[1] as DiceNode)
    }
    case '18num': {
      const num = nodes[0] as Token
      return new NumberNode(num.value as number)
    }
    case '19o4':
    case '21o5': {
      return nodes[0] as DiceNode
    }
    case '20empty':
    case '22empty':
    case '29empty':
    case '36empty':
    case '39empty': {
      return null
    }
    case '23d': {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const o = (nodes[3] as Options)?.options || {}
      const kq = o.k ? 'k' : (o.q ? 'q' : null)
      const pb = o.p ? 'p' : (o.b ? 'b' : null)
      return new DNode(a, b, o.k || o.q, o.p || o.b, o.a, kq, pb)
    }
    case '30pp':
    case '31pb': {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const pb = (nodes[1] as Token).value as 'p' | 'b'
      return new PNode(a, b, pb)
    }
    case '32a': {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const o = (nodes[3] as Options)?.options || {}
      return new ANode(a, b, o.k, o.q, o.m)
    }
    case '37c': {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const o = (nodes[3] as Options)?.options || {}
      return new CNode(a, b, o.m)
    }
    case '40f': {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      return new FNode(a, b)
    }
    case '24dok':
    case '25doq':
    case '26dop':
    case '27dob':
    case '28doa':
    case '33aok':
    case '34aoq':
    case '35aom':
    case '38com': {
      let prev = nodes[0] as Options
      if (!prev) prev = { options: {}, eval: null }
      const name = (nodes[1] as Token).value as string
      prev.options[name] = nodes[2] as DiceNode
      return prev
    }
    default:
      throw new Error('未知产生式')
  }
}
