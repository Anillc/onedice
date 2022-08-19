import { Env, Node, resolve } from './ast'
import { parse } from './parser'

export * from './parser'

export function dice(input: string): Node {
  return resolve(parse(input))
}

function defaultEnv(env: Env = {}) {
  return {
    d: {
      a: 1, b: 100, c: null, d: 0, e: null,
      ...env.d
    },
    p: {
      a: null, b: 1,
      ...env.p
    },
    a: {
      a: null, b: null, c: 8, d: null, e: 10,
      ...env.a
    },
    c: {
      a: null, b: null, c: 10,
      ...env.c
    },
    f: {
      a: 4, b: 3,
      ...env.f
    },
  }
}