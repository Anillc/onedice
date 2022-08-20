import { Config } from '.'

export interface Polishes {
  [k: string]: Polish
}

export interface Polish {
  name: keyof Polishes
  value?: number
}

export abstract class DiceNode {
  protected polish: Polish = { name: this.constructor.name as never }
  protected abstract _eval(config: Config, polishes: Polish[]): number
  eval(config: Config, polishes: Polish[]): number {
    polishes.push(this.polish)
    const value = this._eval(config, polishes)
    this.polish.value = value
    return value
  }
}
