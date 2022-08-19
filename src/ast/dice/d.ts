import { dice } from '../..'
import { fill, random, sum } from '../../utils'
import { Env, Flow, Node } from '..'

export class DNode implements Node {
  constructor(
    public a: Node,
    public b: Node,
    public c: Node,
    public d: Node,
    public e: Node,
    public kq: 'k' | 'q',
    public pb: 'p' | 'b',
  ) {}

  eval(env: Env, flow: Flow[]): number {
    const a = this.a?.eval(env, flow) ?? env.d.a
    const b = this.b?.eval(env, flow) ?? env.d.b
    const c = this.c?.eval(env, flow) ?? env.d.c ?? a
    const d = this.d?.eval(env, flow) ?? env.d.d
    const e = this.e?.eval(env, flow) ?? env.d.e
    
    let res: number
    if (e !== null) {
      res = dice(`${a}a${b + 1}k${e}m${b}`).eval(env, [])
    } else {
      if (this.kq && this.pb) throw new Error('k/q 与 p/b 不可同时使用')
      if (this.kq && c > b) throw new Error('选取骰子个数大于骰子个数')
      let roll = fill(a).map(_ => random(1, b))
      roll.sort()
      switch (this.kq || this.pb) {
        case 'k':
          roll.splice(0, b - c)
          break
        case 'q':
          roll.splice(- (b - c))
          break
        case 'p':
        case 'b':
          roll = roll.map(_ => dice(`${this.pb}${d}`).eval(env, []))
          break
      }
      res = sum(roll)
    }
    flow.push([this.string(a, b, c, d, e), res])
    return res
  }

  string(a: number, b: number, c: number, d: number, e: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    const cs = this.kq ? `${this.kq}${c}` : ''
    const ds = this.pb ? `${this.pb}${d}` : ''
    const es = e !== null ? `a${e}` : ''
    return as + 'd' + bs + cs + ds + es
  }
}