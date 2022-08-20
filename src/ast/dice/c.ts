import { fill, negative } from '../../utils'
import { Config, Flow, DiceNode } from '..'

export class CNode implements DiceNode {
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
  ) {}

  eval(config: Config, flow: Flow[]): number {
    const a = this.a?.eval(config, flow) ?? config.c.a
    const b = this.b?.eval(config, flow) ?? config.c.b
    const c = this.c?.eval(config, flow) ?? config.c.c
    if (negative(a, b, c)) throw new Error('参数不能为负数')
    if (a === null || b === null) throw new Error('参数错误: 参数错误： AcBmC 中 A, B 是必须的')
    if (b < 2) throw new Error('参数错误: AcBmC 中 B 不能小于 2')
    if (c < 1) throw new Error('参数错误: AcBmC 中 C 不能小于 1')

    let rollCount = 0

    let count = a
    let roll: number[]
    let round = 0
    while (count !== 0) {
      rollCount += count
      if (rollCount > config.maxRollCount) throw new Error('掷出骰子过多')

      roll = fill(count).map(_ => config.random(1, c))
      count = roll.filter(n => n >= b).length
      round++
    }
    const result = (round === 0 ? 0 : round - 1) * c + Math.max(...roll)
    flow.push([this.string(a, b, c), result])
    return result
  }

  string(a: number, b: number, c: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    const cs = c ? `m${c}` : ''
    return as + 'c' + bs + cs
  }
}