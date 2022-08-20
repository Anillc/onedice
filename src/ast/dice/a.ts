import { fill, negative } from '../../utils'
import { Config } from '..'
import { DiceNode, Polish } from '../node'

declare module '../..' {
  interface Polishes {
    'ANode': APolish
  }
}

export interface APolish extends Polish {
  expression: string
  rounds: [number, boolean, boolean][][]
  a: number, b: number, c: number, d: number, e: number
}

export class ANode extends DiceNode {
  protected polish: APolish
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
    public d: DiceNode,
    public e: DiceNode,
  ) { super() }

  protected _eval(config: Config, polishes: Polish[]): number {
    const a = this.a?.eval(config, polishes) ?? config.a.a
    const b = this.b?.eval(config, polishes) ?? config.a.b
    const c = this.c?.eval(config, polishes) ?? config.a.c
    const d = this.d?.eval(config, polishes) ?? config.a.d
    const e = this.e?.eval(config, polishes) ?? config.a.e
    if (negative(a, b, c, d, e)) throw new Error('参数不能为负数')
    if (a === null || b === null) throw new Error('参数错误： AaBkCqDmE 中 A, B 是必须的')
    if (b < 2) throw new Error('参数错误: AaBkCqDmE 中 B 不能小于 2')
    if (e < 1) throw new Error('参数错误: AaBkCqDmE 中 E 不能小于 1')
    Object.assign(this.polish, {
      a, b, c, d, e, rounds: [],
      expression: this.string(a, b, c, d, e),
    })
    
    let rollCount = 0

    let count = a
    const roll: [number, boolean, boolean][] = []
    while (count !== 0) {
      rollCount += count
      if (rollCount > config.maxRollCount) throw new Error('掷出骰子过多')
      const r: [number, boolean, boolean][] =
        fill(count).map(_ => [config.random(1, e), false, false])
      this.polish.rounds.push(r)
      count = r.filter(n => {
        if (n[0] < b) return false
        return n[1] = true
      }).length
      roll.push(...r)
    }
    return roll.filter(n => {
      if (c !== null && n[0] < c) return false
      if (d !== null && n[0] > d) return false
      return n[2] = true
    }).length
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