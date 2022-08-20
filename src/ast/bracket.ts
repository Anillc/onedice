import { Config } from '.'
import { DiceNode, Polish } from './node'

declare module '..' {
  interface Polishes {
    'BracketNode': Polish
  }
}

export class BracketNode extends DiceNode {
  constructor(public inner: DiceNode) { super() }

  protected _eval(config: Config, polishes: Polish[]): number {
    const inner = this.inner.eval(config, polishes)
    this.polish.value = inner
    return inner
  }
}