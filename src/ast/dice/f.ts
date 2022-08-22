import { Config, fill, negative, sum, indent } from '../..'
import { DiceNode, NumberNode } from '..'

export interface FEvaluation {
  expression: string
  roll: number[]
  a: number, b: number
  value: number
}

export class FNode implements DiceNode<FEvaluation> {
  evaluation: FEvaluation
  constructor(
    public a: DiceNode,
    public b: DiceNode,
  ) {}

  eval(config: Config): number {
    const a = this.a?.eval(config) ?? config.f.a
    const b = this.b?.eval(config) ?? config.f.b
    if (negative(a, b)) throw new Error('参数不能为负数')
    if (a > config.maxRollCount) throw new Error('掷出骰子过多')
    this.evaluation = {
      a, b,
      expression: this.expression(a, b),
      roll: null, value: null,
    }

    const op = [1, -1, 0]
    const roll = fill(a).map(_ => op[config.random(0, 2)])
    this.evaluation.roll = roll
    const value = sum(roll)
    this.evaluation.value = value
    return value
  }

  expression(a: number, b: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    return as + 'f' + bs
  }

  pure(): boolean {
    return false
  }

  toString(indentation = 0): string {
    const roll = this.evaluation.roll.join(', ')
    const result = this.evaluation.value
    if (this.a?.pure() ?? true) {
      return `{${roll}}(${result})`
    }
    const idt = indent(indentation)
    const idt1 = indent(indentation + 1)
    const lines = [
      `{`,
      `${idt1}A: ${this.a.toString(indentation + 1)}`,
      `${idt1}roll: [${roll}]`,
      `${idt}}(${result})`,
    ]
    return lines.join('\n')
  }
}