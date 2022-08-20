import { dice } from '..'
import { Config, DiceNode, Flow } from '.'

export class InterpolationNode implements DiceNode {
  constructor(public key: string) {}

  eval(config: Config, flow: Flow[]): number {
    const input = config.env[this.key]
    if (!input) throw new Error(`没有名为 ${this.key} 的表达式`)
    return dice(input)({
      env: {}, // avoid infinite recursion
      ...config,
    }, flow)
  }
}