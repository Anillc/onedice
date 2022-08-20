import { fill, negative, random } from '../../utils'
import { Env, Flow, DiceNode } from '..'

export class ANode implements DiceNode {
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
    public d: DiceNode,
    public e: DiceNode,
  ) {}

  eval(env: Env, flow: Flow[]): number {
    const a = this.a?.eval(env, flow) ?? env.a.a
    const b = this.b?.eval(env, flow) ?? env.a.b
    const c = this.c?.eval(env, flow) ?? env.a.c
    const d = this.d?.eval(env, flow) ?? env.a.d
    const e = this.e?.eval(env, flow) ?? env.a.e
    if (negative(a, b, c, d, e)) throw new Error('参数不能为负数')
    if (a === null || b === null) throw new Error('参数错误： AaBkCqDmE 中 A, B 是必须的')
    if (b < 2) throw new Error('参数错误: AaBkCqDmE 中 B 不能小于 2')
    if (e < 1) throw new Error('参数错误: AaBkCqDmE 中 E 不能小于 1')
    
    let count = a
    const roll = []
    while (count !== 0) {
      const r = fill(count).map(_ => random(1, e))
      count = r.filter(n => n >= b).length
      roll.push(...r)
    }
    const result = roll.filter(e => {
      if (c !== null && e < c) return false
      if (d !== null && e > d) return false
      return true
    }).length
    flow.push([this.string(a, b, c, d, e), result])
    return result
  }

  string(a: number, b: number, c: number, d: number, e: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    const cs = c !== null ? `k${c}` : ''
    const ds = d !== null ? `q${d}` : ''
    const es = e !== null ? `m${e}` : ''
    return as + 'a' + bs + cs + ds + es
  }
}