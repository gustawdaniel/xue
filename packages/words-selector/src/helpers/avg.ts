export function avg(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length
}
