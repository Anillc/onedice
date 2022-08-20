import { Env, Flow, DiceNode } from '.'

export class NumberNode implements DiceNode {
  constructor(public num: number) {}

  eval(env: Env, flow: Flow[]): number {
    return this.num
  }
}