import { Config } from '..'
import { DiceNode, NumberNode } from '.'

export interface SimpleEvaluation {
  operator: string
  left: number
  right: number
  value: number
}

export class SimpleNode implements DiceNode<SimpleEvaluation> {
  evaluation: SimpleEvaluation
  constructor(
    public operator: string,
    public left: DiceNode,
    public right: DiceNode,
  ) {}

  eval(config: Config): number {
    const left = this.left.eval(config)
    const right = this.right.eval(config)
    let value: number
    switch (this.operator) {
      case '+':
        value = left + right
        break
      case '-':
        value = left - right
        break
      case '*':
      case 'x':
        value = left * right
        break
      case '/':
        value = left / right
        break
      case '^':
        value = Math.pow(left, right)
        break
      default:
        throw new Error('未知运算符')
    }
    this.evaluation = {
      left, right, operator: this.operator, value
    }
    return value
  }

  pure(): boolean {
    const left = this.left ? this.left.pure() : true
    const right = this.right ? this.right.pure() : true
    return left && right
  }

  toString(indentation = 0): string {
    return `${
      this.left.toString(indentation)
    } ${this.operator} ${
      this.right.toString(indentation)
    }`
  }
}