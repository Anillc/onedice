import { terms } from './grammar.json'

export type Token = {
  type: 'number',
  value: number,
} | {
  type: 'token',
  value: string,
}

export function lexer(input: string) {
  const match = input.matchAll(/(\d+(\.\d+)?)|\S/g)
  return function next(): Token {
    const next = match.next()
    if (next.done) return { type: 'token', value: '$' }
    const value = next.value[0]
    const num = +value
    if (!Object.is(num, NaN)) return { type: 'number', value: num }
    if (!terms.includes(value)) throw new Error(`unknow token ${value}`)
    return { type: 'token', value }
  }
}