import {
  Producer, BufferElement,
  NumberToken, InterpolationToken, TermToken,
} from '../parser'
import { DNode, PNode, CNode, ANode, FNode } from './dice'
import { BracketNode } from './bracket'
import { InterpolationNode } from './interpolation'
import { NumberNode } from './number'
import { SimpleNode } from './simple'
import { UnaryNode } from './unary'
import { Config } from '..'

export * from './bracket'
export * from './simple'
export * from './number'
export * from './unary'
export * from './dice'

export interface DiceNode<T = unknown> {
  evaluation: T
  eval(config: Config): number
  // If this node contains dices. Used to determine whether to show details
  pure(): boolean
  toString(indentation?: number): string
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
    case 7:
    case 8:
    case 9:
    case 11: {
      const operator = nodes[1] as TermToken
      const left = nodes[0] as DiceNode
      const right = nodes[2] as DiceNode
      return new SimpleNode(operator.value, left, right)
    }
    case 4:
    case 5: {
      const operator = nodes[0] as TermToken
      const right = nodes[1] as DiceNode
      return new UnaryNode(operator.value, right)
    }
    case 6:
    case 10:
    case 12:
    case 18: {
      return nodes[0] as DiceNode
    }
    case 13:
    case 14:
    case 15:
    case 16:
    case 17: {
      return nodes[0] as DiceNode
    }
    case 19: {
      return new BracketNode(nodes[1] as DiceNode)
    }
    case 20: {
      const num = nodes[0] as NumberToken
      return new NumberNode(num.value)
    }
    case 21: {
      const int = nodes[0] as InterpolationToken
      return new InterpolationNode(int.value)
    }
    case 22:
    case 24: {
      return nodes[0] as DiceNode
    }
    case 23:
    case 25:
    case 32:
    case 39:
    case 42: {
      return null
    }
    case 26: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const o = (nodes[3] as Options)?.options || {}
      const kq = o.k ? 'k' : (o.q ? 'q' : null)
      const pb = o.p ? 'p' : (o.b ? 'b' : null)
      return new DNode(a, b, o.k || o.q, o.p || o.b, o.a, kq, pb)
    }
    case 33:
    case 34: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const pb = (nodes[1] as TermToken).value as 'p' | 'b'
      return new PNode(a, b, pb)
    }
    case 35: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const o = (nodes[3] as Options)?.options || {}
      return new ANode(a, b, o.k, o.q, o.m)
    }
    case 40: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      const o = (nodes[3] as Options)?.options || {}
      return new CNode(a, b, o.m)
    }
    case 43: {
      const a = nodes[0] as DiceNode
      const b = nodes[2] as DiceNode
      return new FNode(a, b)
    }
    case 27:
    case 28:
    case 29:
    case 30:
    case 31:
    case 36:
    case 37:
    case 38:
    case 41: {
      let prev = nodes[0] as Options
      if (!prev) prev = { options: {} } as Options
      const name = (nodes[1] as TermToken).value
      prev.options[name] = nodes[2] as DiceNode
      return prev
    }
    default:
      throw new Error('未知产生式')
  }
}
