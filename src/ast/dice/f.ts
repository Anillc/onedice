import { fill, negative, sum } from '../../utils'
import { Config } from '..'
import { DiceNode, Polish } from '../node'

declare module '../..' {
  interface Polishes {
    'FNode': FPolish
  }
}

export interface FPolish extends Polish {
  expression: string
  roll: number[]
  a: number, b: number
}

export class FNode extends DiceNode {
  protected polish: FPolish
  constructor(
    public a: DiceNode,
    public b: DiceNode,
  ) { super() }

  protected _eval(config: Config, polishes: Polish[]): number {
    const a = this.a?.eval(config, polishes) ?? config.f.a
    const b = this.b?.eval(config, polishes) ?? config.f.b
    if (negative(a, b)) throw new Error('参数不能为负数')
    if (a > config.maxRollCount) throw new Error('掷出骰子过多')
    Object.assign(this.polish, {
      a, b,
      expression: this.string(a, b),
    })

    const op = [1, -1, 0]
    const roll = fill(a).map(_ => op[config.random(0, 2)])
    this.polish.roll = roll
    const result = sum(roll)
    return result
  }

  string(a: number, b: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    return as + 'f' + bs
  }
}