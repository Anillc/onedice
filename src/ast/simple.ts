import { Config } from '.'

import { DiceNode, Polish } from './node'

declare module '..' {
  interface Polishes {
    'SimpleNode': SimplePolish
  }
}

export interface SimplePolish extends Polish {
  operator: string
  left: number
  right: number
}

export class SimpleNode extends DiceNode {
  protected polish: SimplePolish
  constructor(
    public operator: string,
    public left: DiceNode,
    public right: DiceNode,
  ) { super() }

  protected _eval(config: Config, polishes: Polish[]): number {
    const left = this.left.eval(config, polishes)
    const right = this.right.eval(config, polishes)
    Object.assign(this.polish, {
      left, right, operator: this.operator,
    })
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