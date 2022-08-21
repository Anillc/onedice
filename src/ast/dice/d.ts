import { Config, dice, fill, negative, sum } from '../..'
import { DiceNode } from '..'
import { AEvaluation, PEvaluation } from '.'

export interface DEvaluation {
  expression: string
  aEvaluation: AEvaluation
  pbEvaluations: PEvaluation[]
  roll: [number, boolean][]
  a: number, b: number, c: number, d: number, e: number
  kq: 'k' | 'q', pb: 'p' | 'b'
  value: number
}

export class DNode implements DiceNode<DEvaluation> {
  evaluation: DEvaluation
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
    public d: DiceNode,
    public e: DiceNode,
    public kq: 'k' | 'q',
    public pb: 'p' | 'b',
  ) {}

  eval(config: Config): number {
    const a = this.a?.eval(config) ?? config.d.a
    const b = this.b?.eval(config) ?? config.d.b
    const c = this.c?.eval(config) ?? config.d.c ?? a
    const d = this.d?.eval(config) ?? config.d.d
    const e = this.e?.eval(config) ?? config.d.e
    if (negative(a, b, c, d, e)) throw new Error('参数不能为负数')
    if (b < 1) throw new Error('参数错误: AdB(kq)C(pb)DaE 中 B 不能小于 1')
    this.evaluation = {
      a, b, c, d, e, kq: this.kq, pb: this.pb,
      expression: this.expression(a, b, c, d ,e),
      aEvaluation: null, pbEvaluations: null,
      roll: null, value: null,
    }

    if (e !== null) {
      const aPolishes: AEvaluation[] = []
      const [value, node] = dice(`${a}a${b + 1}k${e}m${b}`, config)
      this.evaluation.aEvaluation = node.evaluation as AEvaluation
      this.evaluation.value = value
      return value
    } else {
      if (this.kq && this.pb) throw new Error('k/q 与 p/b 不可同时使用')
      if (this.kq && c > b) throw new Error('选取骰子个数大于骰子个数')
      const rollCount = this.pb ? a * d : a
      if (rollCount > config.maxRollCount) throw new Error('掷出骰子过多')

      if (this.pb) {
        const pbs = fill(a).map(_ => dice(`${this.pb}${d}`, config))
        this.evaluation.pbEvaluations = pbs.map(n => n[1].evaluation as PEvaluation)
        const value = sum(pbs.map(n => n[0]))
        this.evaluation.value = value
        return value
      }

      const roll: [number, boolean][] = fill(a).map(_ => [config.random(1, b), false])
      roll.sort()
      this.evaluation.roll = [...roll]
      if (this.kq) {
        if (this.kq === 'k') {
          roll.splice(0, b - c + 1)
        } else {
          roll.splice(c)
        }
      }
      roll.forEach(n => n[1] = true)
      const value = sum(roll.map(n => n[0]))
      this.evaluation.value = value
      return value
    }
  }

  expression(a: number, b: number, c: number, d: number, e: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    const cs = this.kq ? `${this.kq}${c}` : ''
    const ds = this.pb ? `${this.pb}${d}` : ''
    const es = e !== null ? `a${e}` : ''
    return as + 'd' + bs + cs + ds + es
  }
}