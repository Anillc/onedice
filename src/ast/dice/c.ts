import { Config, fill, negative } from '../..'
import { DiceNode } from '..'

export interface CEvaluation {
  expression: string
  rounds: [number, boolean, boolean][][]
  a: number, b: number, c: number
  value: number
}

export class CNode implements DiceNode<CEvaluation> {
  evaluation: CEvaluation
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
  ) {}

  eval(config: Config): number {
    const a = this.a?.eval(config) ?? config.c.a
    const b = this.b?.eval(config) ?? config.c.b
    const c = this.c?.eval(config) ?? config.c.c
    if (negative(a, b, c)) throw new Error('参数不能为负数')
    if (a === null || b === null) throw new Error('参数错误: 参数错误： AcBmC 中 A, B 是必须的')
    if (b < 2) throw new Error('参数错误: AcBmC 中 B 不能小于 2')
    if (c < 1) throw new Error('参数错误: AcBmC 中 C 不能小于 1')
    this.evaluation = {
      a, b, c, rounds: [],
      expression: this.string(a, b, c),
      value: null,
    }

    let rollCount = 0

    let count = a
    let roll: [number, boolean, boolean][]
    let round = 0
    while (count !== 0) {
      rollCount += count
      if (rollCount > config.maxRollCount) throw new Error('掷出骰子过多')
      roll = fill(count).map(_ => [config.random(1, c), false, false])
      this.evaluation.rounds.push(roll)
      count = roll.filter(n => {
        if (n[0] < b) return false
        return n[1] = true
      }).length
      if (count !== 0) round++
    }
    const max = Math.max(...roll.map(n => n[0]))
    roll.forEach(n => n[0] === max && (n[2] = true))
    const value = round * c + max
    this.evaluation.value = value
    return value
  }

  string(a: number, b: number, c: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    const cs = c ? `m${c}` : ''
    return as + 'c' + bs + cs
  }
}