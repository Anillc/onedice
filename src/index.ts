import { Env, Flow, Node, resolve } from './ast'
import { parse } from './parser'

export * from './ast'
export * from './parser'

interface Dice {
  root: Node
  (env?: Env, flow?: Flow[]): number
}

export function dice(input: string): Dice {
  const root = resolve(parse(input))
  const dice = (env: Env = {}, flow = []) => root.eval(getEnv(env), flow)
  Object.assign(dice, { root })
  return dice as Dice
}

function getEnv(env: Env = {}) {
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