import { Env, Flow, Node } from '.'

export class SimpleNode implements Node {
  constructor(
    public operator: string,
    public left: Node,
    public right: Node,
  ) {}

  eval(env: Env, flow: Flow[]): number {
    const left = this.left.eval(env, flow)
    const right = this.right.eval(env, flow)
    switch (this.operator) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '*':
      case 'x':
        return left * right
      case '/':
        return left / right
      case '^':
        return Math.pow(left, right)
      default:
        throw new Error('unknown operator')
    }
  }
}