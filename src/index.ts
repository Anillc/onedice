import { parse } from './parser'
import { random } from './utils'
import { DiceNode } from './ast'

export * from './ast'
export * from './parser'
export * from './utils'

export interface Config {
  random?: (min: number, max: number) => number
  maxRollCount?: number
  env?: Record<string, string>
  d?: { a?: number, b?: number, c?: number, d?: number, e?: number }
  p?: { a?: number, b?: number }
  a?: { a?: number, b?: number, c?: number, d?: number, e?: number }
  c?: { a?: number, b?: number, c?: number }
  f?: { a?: number, b?: number }
}

export function dice(input: string, config: Config = {}): [number, DiceNode] {
  const root = parse(input) as DiceNode
  const value = root.eval(getConfig(config))
  return [value, root]
}

function getConfig(config: Config = {}): Config {
  return {
    random,
    maxRollCount: 10000,
    env: {},
    ...config,
    d: {
      a: 1, b: 100, c: null, d: 0, e: null,
      ...config.d
    },
    p: {
      a: null, b: 1,
      ...config.p
    },
    a: {
      a: null, b: null, c: 8, d: null, e: 10,
      ...config.a
    },
    c: {
      a: null, b: null, c: 10,
      ...config.c
    },
    f: {
      a: 4, b: 3,
      ...config.f
    },
  }
}