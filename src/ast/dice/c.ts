import { fill, negative, random } from '../../utils'
import { Env, Flow, DiceNode } from '..'

export class CNode implements DiceNode {
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
  ) {}

  eval(env: Env, flow: Flow[]): number {
    const a = this.a?.eval(env, flow) ?? env.c.a
    const b = this.b?.eval(env, flow) ?? env.c.b
    const c = this.c?.eval(env, flow) ?? env.c.c
    if (negative(a, b, c)) throw new Error('参数不能为负数')
    if (a === null || b === null) throw new Error('参数错误: 参数错误： AcBmC 中 A, B 是必须的')
    if (b < 2) throw new Error('参数错误: AcBmC 中 B 不能小于 2')
    if (c < 1) throw new Error('参数错误: AcBmC 中 C 不能小于 1')

    let count = a
    let roll: number[]
    let round = 0
    while (count !== 0) {
      roll = fill(count).map(_ => random(1, c))
      count = roll.filter(n => n >= b).length
      round++
    }
    const result = (round == 0 ? round - 1 : 0) * c + Math.max(...roll)
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