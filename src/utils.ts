export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function sum(nums: number[]) {
  return nums.reduce((acc, x) => acc + x)
}

export function fill(size: number) {
  return new Array(size).fill(0)
}