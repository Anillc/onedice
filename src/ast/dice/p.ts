import { fill, negative, random } from '../../utils'
import { Env, Flow, DiceNode } from '..'

export class PNode implements DiceNode {
  constructor(public a: DiceNode, public b: DiceNode, public pb: 'p' | 'b') {}

  eval(env: Env, flow: Flow[]): number {
    const a = this.a?.eval(env, flow) ?? env.p.a
    const b = this.b?.eval(env, flow) ?? env.p.b
    if (negative(a, b)) throw new Error('参数不能为负数')

    const one = random(0, 9)
    const ten = random(0, 9)
    const roll = fill(b).map(_ => random(0, 9)).concat(ten)
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