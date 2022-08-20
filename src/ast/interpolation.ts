import { dice } from '..'
import { Config } from '.'
import { DiceNode, Polish } from './node'

declare module '..' {
  interface Polishes {
    'InterpolationNode': InterpolationPolish
  }
}

export interface InterpolationPolish extends Polish {
  input: string
}

export class InterpolationNode extends DiceNode {
  protected polish: InterpolationPolish
  constructor(public key: string) { super() }

  protected _eval(config: Config, polishes: Polish[]): number {
    const input = config.env[this.key]
    if (!input) throw new Error(`没有名为 ${this.key} 的表达式`)
    this.polish.input = input
    return dice(input)({
      env: {}, // avoid infinite recursion
      ...config,
    }, polishes)
  }
}