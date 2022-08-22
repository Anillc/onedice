import { Config, fill, negative, indent } from '../..'
import { DiceNode } from '..'

export interface CEvaluation {
  expression: string
  rounds: [number, boolean, boolean][][]
  count: number, last: number
  a: number, b: number, c: number
  value: number
}

export class CNode implements DiceNode<CEvaluation> {
  evaluation: CEvaluation
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
  ) {}

  eval(config: Config): number {
    const a = this.a?.eval(config) ?? config.c.a
    const b = this.b?.eval(config) ?? config.c.b
    const c = this.c?.eval(config) ?? config.c.c
    if (negative(a, b, c)) throw new Error('参数不能为负数')
    if (a === null || b === null) throw new Error('参数错误: 参数错误： AcBmC 中 A, B 是必须的')
    if (b < 2) throw new Error('参数错误: AcBmC 中 B 不能小于 2')
    if (c < 1) throw new Error('参数错误: AcBmC 中 C 不能小于 1')
    this.evaluation = {
      a, b, c, rounds: [],
      count: null, last: null,
      expression: this.expression(a, b, c),
      value: null,
    }

    let rollCount = 0

    let count = a
    let roll: [number, boolean, boolean][]
    let round = 0
    while (count !== 0) {
      rollCount += count
      if (rollCount > config.maxRollCount) throw new Error('掷出骰子过多')
      roll = fill(count).map(_ => [config.random(1, c), false, false])
      this.evaluation.rounds.push(roll)
      count = roll.filter(n => {
        if (n[0] < b) return false
        return n[1] = true
      }).length
      if (count !== 0) round++
    }
    const max = Math.max(...roll.map(n => n[0]))
    roll.forEach(n => n[0] === max && (n[2] = true))
    const value = round * c + max
    this.evaluation.count = round
    this.evaluation.last = max
    this.evaluation.value = value
    return value
  }

  expression(a: number, b: number, c: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    const cs = c ? `m${c}` : ''
    return as + 'c' + bs + cs
  }

  pure(): boolean {
    return false
  }

  toString(indentation = 0): string {
    const idt = indent(indentation)
    const idt1 = indent(indentation + 1)
    const idt2 = indent(indentation + 2)
    const a = this.a ? this.a.toString(indentation + 1) : this.evaluation.a
    const b = this.b ? this.b.toString(indentation + 1) : this.evaluation.b
    const c = this.c ? this.c.toString(indentation + 1) : this.evaluation.c
    const { count, last, value: result, c: cNum } = this.evaluation
    const rounds = this.evaluation.rounds
      .map(round => {
        const r = round.map(([n, s1, s2]) => {
          if (s1 && !s2) return `<${n}>`
          if (!s1 && s2) return `[${n}]`
          // this won't appear in c
          // if (s1 && s2) return `<[${n}]>`
          return `${n}`
        }).join(', ')
        return `${idt2}{${r}}`
      }).join('\n')
    const lines = [
      `{`,
      `${idt1}A: ${a}, B: ${b}, C: ${c}`,
      `${idt1}rounds: {\n${rounds}\n${idt1}}`,
      `${idt}}(${count} * ${cNum} + ${last})(${result})`,
    ]
    return lines.join('\n')
  }
}