import { Config, dice, fill, negative, sum, indent } from '../..'
import { DiceNode } from '..'
import { ANode, PNode } from '.'

export interface DEvaluation {
  expression: string
  aNode: ANode
  pNodes: PNode[]
  roll: [number, boolean][]
  a: number, b: number, c: number, d: number, e: number
  kq: 'k' | 'q', pb: 'p' | 'b'
  value: number
}

export class DNode implements DiceNode<DEvaluation> {
  evaluation: DEvaluation
  constructor(
    public a: DiceNode,
    public b: DiceNode,
    public c: DiceNode,
    public d: DiceNode,
    public e: DiceNode,
    public kq: 'k' | 'q',
    public pb: 'p' | 'b',
  ) {}

  eval(config: Config): number {
    const a = this.a?.eval(config) ?? config.d.a
    const b = this.b?.eval(config) ?? config.d.b
    const c = this.c?.eval(config) ?? config.d.c ?? a
    const d = this.d?.eval(config) ?? config.d.d
    const e = this.e?.eval(config) ?? config.d.e
    if (negative(a, b, c, d, e)) throw new Error('参数不能为负数')
    if (b < 1) throw new Error('参数错误: AdB(kq)C(pb)DaE 中 B 不能小于 1')
    this.evaluation = {
      a, b, c, d, e, kq: this.kq, pb: this.pb,
      expression: this.expression(a, b, c, d ,e),
      aNode: null, pNodes: null,
      roll: null, value: null,
    }

    if (e !== null) {
      const [value, node] = dice(`${a}a${b + 1}k${e}m${b}`, config)
      this.evaluation.aNode = node as ANode
      this.evaluation.value = value
      return value
    } else {
      if (this.kq && this.pb) throw new Error('k/q 与 p/b 不可同时使用')
      if (this.kq && c > b) throw new Error('选取骰子个数大于骰子个数')
      const rollCount = this.pb ? a * d : a
      if (rollCount > config.maxRollCount) throw new Error('掷出骰子过多')

      if (this.pb) {
        const pbs = fill(a).map(_ => dice(`${this.pb}${d}`, config))
        this.evaluation.pNodes = pbs.map(n => n[1] as PNode)
        const value = sum(pbs.map(n => n[0]))
        this.evaluation.value = value
        return value
      }

      const roll: [number, boolean][] = fill(a).map(_ => [config.random(1, b), false])
      roll.sort()
      this.evaluation.roll = [...roll]
      if (this.kq) {
        if (this.kq === 'k') {
          roll.splice(0, a - c)
        } else {
          roll.splice(c)
        }
      }
      roll.forEach(n => n[1] = true)
      const value = sum(roll.map(n => n[0]))
      this.evaluation.value = value
      return value
    }
  }

  expression(a: number, b: number, c: number, d: number, e: number) {
    const as = String(a ?? '')
    const bs = String(b ?? '')
    const cs = this.kq ? `${this.kq}${c}` : ''
    const ds = this.pb ? `${this.pb}${d}` : ''
    const es = e !== null ? `a${e}` : ''
    return as + 'd' + bs + cs + ds + es
  }

  pure(): boolean {
    return false
  }

  toString(indentation = 0): string {
    const idt = indent(indentation)
    const idt1 = indent(indentation + 1)
    const pure = (this.a?.pure() ?? true)
      && (this.b?.pure() ?? true)
      && (this.c?.pure() ?? true)
      && (this.d?.pure() ?? true)
      && (this.e?.pure() ?? true)
    const a = this.a ? this.a.toString(indentation + 1) : this.evaluation.a
    const b = this.b ? this.b.toString(indentation + 1) : this.evaluation.b
    const c = this.c ? this.c.toString(indentation + 1) : this.evaluation.c
    const d = this.d ? this.d.toString(indentation + 1) : this.evaluation.d
    const e = this.e ? this.e.toString(indentation + 1) : this.evaluation.e
    const show = [
      a !== null ? `A: ${a}` : null,
      b !== null ? `B: ${b}` : null,
      c !== null ? `C: ${c}` : null,
      d !== null ? `D: ${d}` : null,
      e !== null ? `E: ${e}` : null,
    ].filter(n => n).join(', ')
    const result = this.evaluation.value
    if (this.evaluation.e !== null) {
      const as = this.evaluation.aNode.toString(indentation + 1)
      return [
        `{`,
        `${idt1}${show}`,
        `${idt1}${as}`,
        `${idt}}(${result})`,
      ].join('\n')
    }
    if (this.kq) {
      if (pure) {
        const roll = this.evaluation.roll
          .map(([n, selected]) => selected ? `[${n}]` : n).join(', ')
        return `{${roll}}(${result})`
      }
      return [
        `{`,
        `${idt1}${show}`,
        `${idt}}(${result})`,
      ].join('\n')
    }
    if (this.pb) {
      if (this.evaluation.a === 1 && pure) {
        return this.evaluation.pNodes[0].toString(indentation)
      }
      const idt = indent(indentation)
      const idt1 = indent(indentation + 1)
      const pNodes = this.evaluation.pNodes
      const pbs = pNodes.map(n => idt1 + n.toString(indentation + 1))
      const adds = pNodes.map(n => n.evaluation.value)
        .filter(n => n !== 0).join(' + ')
      const lines = [
        `{`,
        `${idt1}${show}`,
        ...pbs,
        `${idt}}(${adds})(${result})`,
      ]
      return lines.join('\n')
    }
    const roll = this.evaluation.roll.map(n => n[0]).join(', ')
    if (pure) {
      if (this.evaluation.a === 1) return `(${result})`
      return `{${roll}}(${result})`
    }
    return [
      `{`,
      `${idt1}${show}`,
      `${idt1}roll: [${roll}]`,
      `${idt}}(${result})`
    ].join('\n')
  }
}