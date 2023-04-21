import { avg } from './helpers/avg'
import { Range } from './interfaces/Range'

export interface WordSelectorOptions {
  pC?: number
  r?: number
  rMax?: number
  answersCorrectness?: number[]
  history_ranges?: Range[]
}

function isCorrectRange(range: any): boolean {
  return 'from' in range && 'to' in range && typeof range.from === 'number' && typeof range.to === 'number'
}

export class WordSelector {
  public readonly rMax: number = 1000
  public corr: number = 0
  public knownList: number[] = []
  public queueList: number[] = []
  public history_ranges: Range[] = []
  private r: number = 0 // range
  private n: number = 0 // simulation step
  private readonly pC: number = 0.1 // progression coefficient, pC = 0.9 means that only 10% of known words is our equilibrium
  private readonly correctnessHistoryLength: number = 10
  private readonly answersCorrectness: number[] = []

  constructor(options?: WordSelectorOptions) {
    if (options) {
      if ('pC' in options && typeof options.pC === 'number') {
        this.pC = options.pC
      }
      if ('r' in options && typeof options.r === 'number') {
        this.r = options.r
      }
      if ('rMax' in options && typeof options.rMax === 'number') {
        this.rMax = options.rMax
      }
      if ('answersCorrectness' in options && Array.isArray(options.answersCorrectness)) {
        this.answersCorrectness = options.answersCorrectness
        this.corr = avg(this.answersCorrectness)
      }
      if (
        'history_ranges' in options &&
        Array.isArray(options.history_ranges) &&
        options.history_ranges.every((range) => isCorrectRange(range))
      ) {
        this.history_ranges = options.history_ranges
      }
    }
  }

  public getRange(r: number): Range | undefined {
    return this.history_ranges.find((range) => range.from <= r && range.to >= r)
  }

  public nearest(r: number, range: Range): number {
    return range.to - r >= r - range.from && range.from > 1 ? range.from - 1 : range.to + 1
  }

  public update_history_ranges(r: number): void {
    let added = false
    for (const range of this.history_ranges) {
      if (range.from - 1 === r && range.from > 1) {
        range.from -= 1
        added = true
        this.history_ranges = this.history_ranges.filter((subRange) =>
          subRange.to + 1 === r ? (range.from = subRange.from) && false : true
        )
        break
      }
      if (range.to + 1 === r) {
        range.to += 1
        added = true
        this.history_ranges = this.history_ranges.filter((subRange) =>
          subRange.from - 1 === r ? (range.to = subRange.to) && false : true
        )
        break
      }
    }
    if (!added) this.history_ranges.push({ from: r, to: r })
  }

  public saveAnswer(correctness: number): WordSelector {
    // console.log('saveAnswer', correctness)
    if (correctness === 1) {
      this.knownList.push(this.r)
    } else {
      this.queueList.push(this.r)
    }
    this.updateCorrCoefficient(correctness)
    return this
  }

  public getWord(): number {
    if (this.r === 0) {
      this.r = 1
      this.update_history_ranges(this.r)
      return 1
    }

    // console.log('r, corr, pc', this.r, this.corr, this.pC)
    const dr = this.r * (this.corr * this.pC - (1 - this.pC) * (1 - this.corr))
    // console.log('dr', dr)

    this.r = Math.round(this.r + dr)

    if (this.r > this.rMax) this.r = this.rMax
    if (this.r < 1) this.r = 1

    const range = this.getRange(this.r)

    if (range) {
      if (range.to !== this.rMax) {
        this.r = this.nearest(this.r, range)
      } else if (range.from !== 1) {
        this.r = range.from - 1
      } else {
        this.r = Math.ceil(Math.random() * this.rMax)
      }
    }

    this.update_history_ranges(this.r)

    this.n++

    return this.r
  }

  private updateCorrCoefficient(correctness: number): void {
    if (this.answersCorrectness.length >= this.correctnessHistoryLength) {
      this.answersCorrectness.shift()
    }
    this.answersCorrectness.push(correctness)
    this.corr = avg(this.answersCorrectness)
  }
}
