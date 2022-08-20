import { Config, Flow, DiceNode } from '.'

export class NumberNode implements DiceNode {
  constructor(public num: number) {}

  eval(config: Config, flow: Flow[]): number {
    return this.num
  }
}