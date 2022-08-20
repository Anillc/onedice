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

export interface Config {
  random?: (min: number, max: number) => number
  maxRollCount?: number
  env?: Record<string, string>
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
  eval(env: Config, flow: Flow[]): number
}

interface Options extends DiceNode {
  options: Record<string, DiceNode>
}

export function resolve(producer: Producer, nodes: BufferElement[]): DiceNode {
  switch (producer.id) {
    case 1: {
      return nodes[0] as DiceNode
    }
    case 2:
    case 3:
    case 5:
    case 6:
    case 7:
    case 9: {
      const operator = (nodes[1] as Token).value as string
      const left = nodes[0] as DiceNode
      const right = nodes[2] as DiceNode
      return new SimpleNode(operator, left, right)
    }
    case 4:
    case 8:
    case 10:
    case 16: {
      return nodes[0] as DiceNode
    }
    case 11:
    case 12:
    case 13:
    case 14:
    case 15: {
      return nodes[0] as DiceNode
    }
    case 17: {
      return new BracketNode(nodes[1] as DiceNode)
    }
    case 18: {
      const num = nodes[0] as Token
      return new NumberNode(num.value as number)
    }
    case 19:
    case 21: {
      return nodes[0] as DiceNode
    }
    case 20:
    case 22:
    case 29:
    case 36:
    case 39: {
      return null
    }
    case 23: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const o = (nodes[3] as Options)?.options || {}
      const kq = o.k ? 'k' : (o.q ? 'q' : null)
      const pb = o.p ? 'p' : (o.b ? 'b' : null)
      return new DNode(a, b, o.k || o.q, o.p || o.b, o.a, kq, pb)
    }
    case 30:
    case 31: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const pb = (nodes[1] as Token).value as 'p' | 'b'
      return new PNode(a, b, pb)
    }
    case 32: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const o = (nodes[3] as Options)?.options || {}
      return new ANode(a, b, o.k, o.q, o.m)
    }
    case 37: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const o = (nodes[3] as Options)?.options || {}
      return new CNode(a, b, o.m)
    }
    case 40: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      return new FNode(a, b)
    }
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
    case 33:
    case 34:
    case 35:
    case 38: {
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
