import { dice } from '../..'
import { fill, negative, random, sum } from '../../utils'
import { Env, Flow, DiceNode } from '..'

export class DNode implements DiceNode {
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
    public d: DiceNode,
    public e: DiceNode,
    public kq: 'k' | 'q',
    public pb: 'p' | 'b',
  ) {}

  eval(env: Env, flow: Flow[]): number {
    const a = this.a?.eval(env, flow) ?? env.d.a
    const b = this.b?.eval(env, flow) ?? env.d.b
    const c = this.c?.eval(env, flow) ?? env.d.c ?? a
    const d = this.d?.eval(env, flow) ?? env.d.d
    const e = this.e?.eval(env, flow) ?? env.d.e
    if (negative(a, b, c, d, e)) throw new Error('参数不能为负数')
    if (b < 1) throw new Error('参数错误: AdB(kq)C(pb)DaE 中 B 不能小于 1')
    
    let res: number
    if (e !== null) {
      res = dice(`${a}a${b + 1}k${e}m${b}`)()
    } else {
      if (this.kq && this.pb) throw new Error('k/q 与 p/b 不可同时使用')
      if (this.kq && c > b) throw new Error('选取骰子个数大于骰子个数')
      let roll = fill(a).map(_ => random(1, b))
      roll.sort()
      switch (this.kq || this.pb) {
        case 'k':
          roll.splice(0, b - c + 1)
          break
        case 'q':
          roll.splice(c)
          break
        case 'p':
        case 'b':
          roll = roll.map(_ => dice(`${this.pb}${d}`)())
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