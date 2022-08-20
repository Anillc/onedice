import { Config, dice } from '..'
import { DiceNode } from '.'

export interface InterpolationEvaluation {
  input: string
  inputEvaluation: unknown
  value: number
}

export class InterpolationNode implements DiceNode<InterpolationEvaluation> {
  evaluation: InterpolationEvaluation
  constructor(public key: string) {}

  eval(config: Config): number {
    const input = config.env[this.key]
    if (!input) throw new Error(`没有名为 ${this.key} 的表达式`)
    const [value, node] = dice(input, {
      env: {}, // avoid infinite recursion
      ...config,
    })
    this.evaluation = {
      input, value,
      inputEvaluation: node.evaluation,
    }
    return value
  }
}