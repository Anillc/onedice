import { isDigit } from '../utils'

export interface NumberToken {
  name: 'num'
  value: number
}

export interface InterpolationToken {
  name: 'int'
  value: string
}

export interface TermToken {
  name: 'term'
  value: string
}

export type Token = NumberToken | InterpolationToken | TermToken

export function lexer(input: string) {
  const terms = '\\+\\-\\*/\\^\\(\\)dkqpbamcf'
  const regex = new RegExp(`(\\d+(\\.\\d+)?)|{([^}]+)}|([${terms}])|([^${terms} ]+)`, 'g')
  const match = input.matchAll(regex)
  return function next(): Token {
    const next = match.next()
    if (next.done) return { name: 'term', value: '$' }
    if (next.value[1]) {
      return { name: 'num', value: +next.value[1] }
    } else if (next.value[3]) {
      return { name: 'int', value: next.value[3] }
    } else if (next.value[4]) {
      return { name: 'term', value: next.value[4]}
    } else if (next.value[5]) {
      return { name: 'int', value: next.value[5] }
    } else {
      throw new Error(`未知符号 ${next.value[4]}`)
    }
  }
}