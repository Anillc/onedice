import { dice } from '../..'
import { fill, negative, sum } from '../../utils'
import { Config } from '..'
import { APolish } from './a'
import { PPolish } from './p'
import { DiceNode, Polish } from '../node'

declare module '../..' {
  interface Polishes {
    'DNode': DPolish
  }
}

export interface DPolish extends Polish {
  expression: string
  aPolish?: APolish
  pbPolishes?: PPolish[]
  roll?: [number, boolean][]
  a?: number, b?: number, c?: number, d?: number, e?: number
  kq?: 'k' | 'q', pb?: 'p' | 'b'
}

export class DNode extends DiceNode {
  protected polish: DPolish
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
    public d: DiceNode,
    public e: DiceNode,
    public kq: 'k' | 'q',
    public pb: 'p' | 'b',
  ) { super() }

  protected _eval(config: Config, polishes: Polish[]): number {
    const a = this.a?.eval(config, polishes) ?? config.d.a
    const b = this.b?.eval(config, polishes) ?? config.d.b
    const c = this.c?.eval(config, polishes) ?? config.d.c ?? a
    const d = this.d?.eval(config, polishes) ?? config.d.d
    const e = this.e?.eval(config, polishes) ?? config.d.e
    if (negative(a, b, c, d, e)) throw new Error('参数不能为负数')
    if (b < 1) throw new Error('参数错误: AdB(kq)C(pb)DaE 中 B 不能小于 1')
    Object.assign(this.polish, {
      a, b, c, d, e, kq: this.kq, pb: this.pb,
      expression: this.string(a, b, c, d, e),
    })
    
    if (e !== null) {
      const aPolishes: APolish[] = []
      const result = dice(`${a}a${b + 1}k${e}m${b}`)(config, aPolishes)
      this.polish.aPolish = aPolishes[0]
      return result
    } else {
      if (this.kq && this.pb) throw new Error('k/q 与 p/b 不可同时使用')
      if (this.kq && c > b) throw new Error('选取骰子个数大于骰子个数')
      const rollCount = this.pb ? a * d : a
      if (rollCount > config.maxRollCount) throw new Error('掷出骰子过多')

      if (this.pb) {
        const pbPolishes: PPolish[] = []
        const pbs = fill(a).map(_ => {
          const tempPolishes = []
          const temp = dice(`${this.pb}${d}`)(config, tempPolishes)
          pbPolishes.push(tempPolishes[0])
          return temp
        })
        this.polish.pbPolishes = pbPolishes
        return sum(pbs)
      }

      const roll: [number, boolean][] = fill(a).map(_ => [config.random(1, b), false])
      roll.sort()
      this.polish.roll = [...roll]
      if (this.kq) {
        if (this.kq === 'k') {
          roll.splice(0, b - c + 1)
        } else {
          roll.splice(c)
        }
      }
      roll.forEach(n => n[1] = true)
      return sum(roll.map(n => n[0]))
    }
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