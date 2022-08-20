import { terms } from './grammar.json'

export type Token = {
  name: 'num'
  value: number
} | {
  name: 'int' // interpolation
  value: string
} | {
  name: 'term'
  value: string
}

export function lexer(input: string) {
  const match = input.matchAll(/(\d+(\.\d+)?)|{(.+)}|(\S)/g)
  return function next(): Token {
    const next = match.next()
    if (next.done) return { name: 'term', value: '$' }
    if (next.value[1]) {
      return { name: 'num', value: +next.value[1] }
    } else if (next.value[3]) {
      return { name: 'int', value: next.value[3] }
    } else if (next.value[4] && terms.includes(next.value[4])) {
      return { name: 'term', value: next.value[4]}
    } else {
      throw new Error(`未知符号 ${next.value[4]}`)
    }
  }
}