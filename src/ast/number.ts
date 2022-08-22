import { Config, indent } from '..'
import { DiceNode } from '.'

interface NumberEvaluation {
  value: number
}

export class NumberNode implements DiceNode<NumberEvaluation> {
  evaluation: NumberEvaluation
  constructor(public num: number) {}

  eval(config: Config): number {
    this.evaluation = { value: this.num }
    return this.num
  }

  pure(): boolean {
    return true
  }

  toString(indentation = 0): string {
    return `${this.num}`
  }
}