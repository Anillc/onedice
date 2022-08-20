import { fill, negative } from '../../utils'
import { Config, Flow, DiceNode } from '..'

export class PNode implements DiceNode {
  constructor(public a: DiceNode, public b: DiceNode, public pb: 'p' | 'b') {}

  eval(config: Config, flow: Flow[]): number {
    const a = this.a?.eval(config, flow) ?? config.p.a
    const b = this.b?.eval(config, flow) ?? config.p.b
    if (negative(a, b)) throw new Error('参数不能为负数')
    if (b + 2 > config.maxRollCount) throw new Error('掷出骰子过多')

    const one = config.random(0, 9)
    const ten = config.random(0, 9)
    const roll = fill(b).map(_ => config.random(0, 9)).concat(ten)
    const realTen = this.pb === 'p'
      ? Math.max(...roll)
      : Math.min(...roll)
    const result = one === 0
      ? (realTen + 1) * 10 + one
      : realTen * 10 + one
    flow.push([this.string(a, b), result])
    return result
  }

  string(a: number, b: number) {
    return `${a ?? ''}${this.pb}${b ?? ''}`
  }
}