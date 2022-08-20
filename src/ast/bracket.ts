import { Config, Flow, DiceNode } from '.'

export class BracketNode implements DiceNode {
  constructor(public inner: DiceNode) {}

  eval(config: Config, flow: Flow[]): number {
    return this.inner.eval(config, flow)
  }
}