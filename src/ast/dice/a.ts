import { Config, fill, negative } from '../..'
import { DiceNode } from '..'

export interface AEvaluation {
  expression: string
  rounds: [number, boolean, boolean][][]
  a: number, b: number, c: number, d: number, e: number
  value: number
}

export class ANode implements DiceNode<AEvaluation> {
  evaluation: AEvaluation
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
    public d: DiceNode,
    public e: DiceNode,
  ) {}

  eval(config: Config): number {
    const a = this.a?.eval(config) ?? config.a.a
    const b = this.b?.eval(config) ?? config.a.b
    const c = this.c?.eval(config) ?? config.a.c
    const d = this.d?.eval(config) ?? config.a.d
    const e = this.e?.eval(config) ?? config.a.e
    if (negative(a, b, c, d, e)) throw new Error('参数不能为负数')
    if (a === null || b === null) throw new Error('参数错误： AaBkCqDmE 中 A, B 是必须的')
    if (b < 2) throw new Error('参数错误: AaBkCqDmE 中 B 不能小于 2')
    if (e < 1) throw new Error('参数错误: AaBkCqDmE 中 E 不能小于 1')
    this.evaluation = {
      a, b, c, d, e, rounds: [],
      expression: this.string(a, b, c, d, e),
      value: null,
    }
    
    let rollCount = 0

    let count = a
    const roll: [number, boolean, boolean][] = []
    while (count !== 0) {
      rollCount += count
      if (rollCount > config.maxRollCount) throw new Error('掷出骰子过多')
      const r: [number, boolean, boolean][] =
        fill(count).map(_ => [config.random(1, e), false, false])
      this.evaluation.rounds.push(r)
      count = r.filter(n => {
        if (n[0] < b) return false
        return n[1] = true
      }).length
      roll.push(...r)
    }
    const value = roll.filter(n => {
      if (c !== null && n[0] < c) return false
      if (d !== null && n[0] > d) return false
      return n[2] = true
    }).length
    this.evaluation.value = value
    return value
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