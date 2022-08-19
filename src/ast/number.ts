import { Env, Flow, Node } from '.'

export class NumberNode implements Node {
  constructor(public num: number) {}

  eval(env: Env, flow: Flow[]): number {
    return this.num
  }
}