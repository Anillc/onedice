import { Config } from './ast'
import { parse } from './parser'
import { random } from './utils'
import { DiceNode, Polish } from './ast/node'

export * from './ast'
export * from './parser'

export interface Dice {
  root: DiceNode
  (config?: Config, polishes?: Polish[]): number
}

export function dice(input: string): Dice {
  const root = parse(input) as DiceNode
  const dice = (env: Config = {}, polishes = []) => root.eval(getConfig(env), polishes)
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