import { ASTNode, ParserNode, TokenNode } from 'src/parser'
import { ANode } from './dice/a'
import { CNode } from './dice/c'
import { DNode } from './dice/d'
import { FNode } from './dice/f'
import { PNode } from './dice/p'
import { NumberNode } from './number'
import { SimpleNode } from './simple'

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

export interface Node {
  eval(env: Env, flow: Flow[]): number
}


export function resolve(node: ParserNode): Node {
  const { producer, value } = node as ASTNode
  switch (producer.id) {
    case '1g': {
      return resolve(value[0])
    }
    case '2add':
    case '3sub':
    case '5mul1':
    case '6mul2':
    case '7div':
    case '9power': {
      const operator = (value[1] as TokenNode).value.value as string
      const left = resolve(value[0])
      const right = resolve(value[1])
      return new SimpleNode(operator, left, right)
    }
    case '4elem':
    case '8elem':
    case '10elem':
    case '16elem': {
      return resolve(value[0])
    }
    case '11d':
    case '12p':
    case '13a':
    case '14c':
    case '15f': {
      return resolve(value[0])
    }
    case '17brac': {
      return resolve(value[1])
    }
    case '18num': {
      const num = value[0] as TokenNode
      return new NumberNode(num.value.value as number)
    }
    case '19o':
    case '39o4': {
      return resolve(value[0])
    }
    case '20empty':
    case '40empty': {
      return null
    }
    case '21d': {
      const a = resolve(value[0])
      const b = resolve(value[2])
      const o: Record<string, Node> = {}
      let option = value[3] as ASTNode
      while (option.producer.id !== '27empty') {
        const key = (option.value[1] as TokenNode).value.value as string
        o[key] = resolve(option.value[2]) 
      }
      const kq = o.k ? 'k' : (o.q ? 'q' : null)
      const pb = o.p ? 'p' : (o.b ? 'b' : null)
      return new DNode(a, b, o.k || o.q, o.p || o.b, o.a, kq, pb)
    }
    case '28pp':
    case '29pb': {
      const a = resolve(value[0])
      const b = resolve(value[2])
      const pb = (value[1] as TokenNode).value.value as 'p' | 'b'
      return new PNode(a, b, pb)
    }
    case '30a': {
      const a = resolve(value[0])
      const b = resolve(value[2])
      const o: Record<string, Node> = {}
      let option = value[3] as ASTNode
      while (option.producer.id !== '34empty') {
        const key = (option.value[1] as TokenNode).value.value as string
        o[key] = resolve(option.value[2]) 
      }
      return new ANode(a, b, o.k, o.q, o.m)
    }
    case '35c': {
      const a = resolve(value[0])
      const b = resolve(value[2])
      const o: Record<string, Node> = {}
      let option = value[3] as ASTNode
      while (option.producer.id !== '37empty') {
        const key = (option.value[1] as TokenNode).value.value as string
        o[key] = resolve(option.value[2]) 
      }
      return new CNode(a, b, o.m)
    }
    case '38f': {
      const a = resolve(value[0])
      const b = resolve(value[2])
      return new FNode(a, b)
    }
    default:
      throw new Error('未知产生式')
  }
}
