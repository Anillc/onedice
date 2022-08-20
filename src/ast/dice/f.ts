import { fill, random, sum } from '../../utils'
import { Env, Flow, DiceNode } from '..'

export class FNode implements DiceNode {
  constructor(
    public a: DiceNode,
    public b: DiceNode,
  ) {}

  eval(env: Env, flow: Flow[]): number {
    const a = this.a?.eval(env, flow) ?? env.f.a
    const b = this.b?.eval(env, flow) ?? env.f.b
    const op = [1, -1, 0]
    const result = sum(fill(a).map(_ => op[random(0, 2)]))
    flow.push([this.string(a, b), result])
    return result
  }

  string(a: number, b: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    return as + 'f' + bs
  }
}