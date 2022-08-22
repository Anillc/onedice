export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function sum(nums: number[]) {
  return nums.reduce((acc, x) => acc + x, 0)
}

export function fill(size: number) {
  return new Array(size).fill(0)
}

export function negative(...nums: number[]) {
  return nums.find(num => num < 0) !== undefined
}

export function indent(count: number) {
  return fill(count).map(_ => '  ').join('')
}