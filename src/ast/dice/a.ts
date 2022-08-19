import { fill, random } from '../../utils'
import { Env, Flow, Node } from '..'

export class ANode implements Node {
  constructor(
    public a: Node,
    public b: Node,
    public c: Node,
    public d: Node,
    public e: Node,
  ) {}

  eval(env: Env, flow: Flow[]): number {
    const a = this.a?.eval(env, flow) ?? env.a.a
    const b = this.b?.eval(env, flow) ?? env.a.b
    const c = this.c?.eval(env, flow) ?? env.a.c
    const d = this.d?.eval(env, flow) ?? env.a.d
    const e = this.e?.eval(env, flow) ?? env.a.e
    if (a === null || b === null) throw new Error('参数错误')
    
    let count = a
    const roll = []
    while (count !== 0) {
      const r = fill(count).map(_ => random(1, e))
      count = r.filter(e => e >= b).length
      roll.push(...r)
    }
    const result = roll.filter(e => {
      if (c && e < c) return false
      if (d && e > d) return false
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