import { Config, fill, negative } from '../..'
import { DiceNode } from '..'

export interface PEvaluation {
  expression: string
  d100: number
  roll: [number, boolean][]
  a?: number, b?: number, pb: 'p' | 'b'
  value: number
}

export class PNode implements DiceNode<PEvaluation> {
  evaluation: PEvaluation
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public pb: 'p' | 'b'
  ) {}

  eval(config: Config): number {
    const a = this.a?.eval(config) ?? config.p.a
    const b = this.b?.eval(config) ?? config.p.b
    if (negative(a, b)) throw new Error('参数不能为负数')
    if (b + 2 > config.maxRollCount) throw new Error('掷出骰子过多')
    this.evaluation = {
      a, b, pb: this.pb,
      expression: this.expression(a, b),
      d100: null, roll: null, value: null,
    }

    const one = config.random(0, 9)
    const ten = config.random(0, 9)
    if (one === 0) {
      this.evaluation.d100 = (ten + 1) * 10
    } else {
      this.evaluation.d100 = ten * 10 + one
    }
    const roll: [number, boolean][] = fill(b).map(_ => [config.random(0, 9), false])
    const realTen = this.pb === 'p'
      ? Math.max(...roll.map(n => n[0]).concat(ten))
      : Math.min(...roll.map(n => n[0]).concat(ten))
    roll.forEach(n => n[0] === realTen && (n[1] = true))
    if (one === 0) roll.forEach(n => n[0]++)
    this.evaluation.roll = roll
    const value = one === 0
      ? (realTen + 1) * 10 + one
      : realTen * 10 + one
    this.evaluation.value = value
    return value
  }

  expression(a: number, b: number) {
    return `${a ?? ''}${this.pb}${b ?? ''}`
  }
}