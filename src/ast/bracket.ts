import { Env, Flow, DiceNode } from '.'

export class BracketNode implements DiceNode {
  constructor(public inner: DiceNode) {}

  eval(env: Env, flow: Flow[]): number {
    return this.inner.eval(env, flow)
  }
}