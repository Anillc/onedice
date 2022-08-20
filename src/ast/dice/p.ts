import { fill, negative } from '../../utils'
import { Config } from '..'
import { DiceNode, Polish } from '../node'

declare module '../..' {
  interface Polishes {
    'PNode': PPolish
  }
}

export interface PPolish extends Polish {
  expression: string
  d100: number
  roll: [number, boolean][]
  a?: number, b?: number, pb: 'p' | 'b'
}

export class PNode extends DiceNode {
  protected polish: PPolish
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public pb: 'p' | 'b'
  ) { super() }

  protected _eval(config: Config, polishes: Polish[]): number {
    const a = this.a?.eval(config, polishes) ?? config.p.a
    const b = this.b?.eval(config, polishes) ?? config.p.b
    if (negative(a, b)) throw new Error('参数不能为负数')
    if (b + 2 > config.maxRollCount) throw new Error('掷出骰子过多')
    Object.assign(this.polish, {
      a, b, pb: this.pb,
      expression: this.string(a, b),
    })

    const one = config.random(0, 9)
    const ten = config.random(0, 9)
    if (one === 0) {
      this.polish.d100 = (ten + 1) * 10
    } else {
      this.polish.d100 = ten * 10 + one
    }
    const roll: [number, boolean][] = fill(b).map(_ => [config.random(0, 9), false])
    const realTen = this.pb === 'p'
      ? Math.max(...roll.map(n => n[0]).concat(ten))
      : Math.min(...roll.map(n => n[0]).concat(ten))
    roll.forEach(n => n[0] === realTen && (n[1] = true))
    if (one === 0) roll.forEach(n => n[0]++)
    this.polish.roll = roll
    return one === 0
      ? (realTen + 1) * 10 + one
      : realTen * 10 + one
  }

  string(a: number, b: number) {
    return `${a ?? ''}${this.pb}${b ?? ''}`
  }
}