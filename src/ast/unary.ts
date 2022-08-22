
import { Config } from '..'
import { DiceNode, NumberNode } from '.'

export interface UnaryEvaluation {
  operator: string
  right: number
  value: number
}

export class UnaryNode implements DiceNode<UnaryEvaluation> {
  evaluation: UnaryEvaluation
  constructor(
    public operator: string,
    public right: DiceNode,
  ) {}

  eval(config: Config): number {
    const right = this.right.eval(config)
    let value: number
    switch (this.operator) {
      case '+':
        value = +right
        break
      case '-':
        value = -right
        break
      default:
        throw new Error('未知运算符')
    }
    this.evaluation = {
      right, operator: this.operator, value
    }
    return value
  }

  pure(): boolean {
    return this.right ? this.right.pure() : true
  }

  toString(indentation = 0): string {
    return `${this.operator}${this.right.toString(indentation)}`
  }
}