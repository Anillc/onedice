import { fill, random } from '../../utils'
import { Env, Flow, Node } from '..'

export class PNode implements Node {
  constructor(public a: Node, public b: Node, public pb: 'p' | 'b') {}

  eval(env: Env, flow: Flow[]): number {
    const a = this.a?.eval(env, flow) ?? env.p.a
    const b = this.b?.eval(env, flow) ?? env.p.b
    const one = random(1, 10)
    const ten = random(0, 9)
    const roll = fill(b + 1).map(_ => random(1, 10)).concat(ten)
    const result = this.pb === 'p'
      ? Math.max(...roll) * 10 + one
      : Math.min(...roll) * 10 + one
    flow.push([this.string(a, b), result])
    return result
  }

  string(a: number, b: number) {
    return `${a ?? ''}${this.pb}${b ?? ''}`
  }
}