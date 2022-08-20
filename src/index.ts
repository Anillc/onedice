import { Config, Flow, DiceNode } from './ast'
import { parse } from './parser'
import { random } from './utils'

export * from './ast'
export * from './parser'

interface Dice {
  root: DiceNode
  (config?: Config, flow?: Flow[]): number
}

export function dice(input: string): Dice {
  const root = parse(input) as DiceNode
  const dice = (env: Config = {}, flow = []) => root.eval(getConfig(env), flow)
  Object.assign(dice, { root })
  return dice as Dice
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