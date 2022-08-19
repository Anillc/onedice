import { fill, random } from '../../utils'
import { Env, Flow, Node } from '..'

export class CNode implements Node {
  constructor(
    public a: Node,
    public b: Node,
    public c: Node,
  ) {}

  eval(env: Env, flow: Flow[]): number {
    const a = this.a?.eval(env, flow) ?? env.c.a
    const b = this.b?.eval(env, flow) ?? env.c.b
    const c = this.c?.eval(env, flow) ?? env.c.c
    if (!a || !b) throw new Error('参数错误')

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