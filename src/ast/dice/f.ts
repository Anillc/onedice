import { fill, negative, sum } from '../../utils'
import { Config, Flow, DiceNode } from '..'

export class FNode implements DiceNode {
  constructor(
    public a: DiceNode,
    public b: DiceNode,
  ) {}

  eval(config: Config, flow: Flow[]): number {
    const a = this.a?.eval(config, flow) ?? config.f.a
    const b = this.b?.eval(config, flow) ?? config.f.b
    if (negative(a, b)) throw new Error('参数不能为负数')
    if (a > config.maxRollCount) throw new Error('掷出骰子过多')

    const op = [1, -1, 0]
    const result = sum(fill(a).map(_ => op[config.random(0, 2)]))
    flow.push([this.string(a, b), result])
    return result
  }

  string(a: number, b: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    return as + 'f' + bs
  }
}