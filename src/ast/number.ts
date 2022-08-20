import { Config } from '.'
import { DiceNode, Polish } from './node'

declare module '..' {
  interface Polishes {
    'NumberNode': Polish
  }
}

export class NumberNode extends DiceNode {
  constructor(public num: number) { super() }

  protected _eval(config: Config, polishes: Polish[]): number {
    return this.num
  }
}