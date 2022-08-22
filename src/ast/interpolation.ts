import { Config, dice, indent } from '..'
import { DiceNode } from '.'

export interface InterpolationEvaluation {
  input: string
  node: DiceNode
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
      node,
    }
    return value
  }

  pure(): boolean {
    return false
  }
  
  toString(indentation = 0): string {
    return `(${this.evaluation.node.toString(indentation)})`
  }
}