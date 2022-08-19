import { Env, Flow, Node } from '.'

export class BracketNode implements Node {
  constructor(public inner: Node) {}

  eval(env: Env, flow: Flow[]): number {
    return this.inner.eval(env, flow)
  }
}