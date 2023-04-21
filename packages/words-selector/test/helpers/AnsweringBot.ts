import { WordSelector } from '../../src'
import { Point2D } from '../../src/interfaces/Point2D'

export class AnsweringBot {
  private readonly knowledge

  constructor(knowledge: (r: number) => number) {
    this.knowledge = knowledge
  }

  public check(r: number): boolean {
    const chance = this.knowledge(r)
    return this.realize(chance)
  }

  private realize(r: number): boolean {
    return Math.random() < r
  }

  public simulate(
    ws: WordSelector,
    nMax: number = 59,
    r0: number = 1
  ): {
    seq: number[]
    min: Point2D[]
    max: Point2D[]
  } {
    let r = r0
    const seq: number[] = []
    const max: Point2D[] = []
    const min: Point2D[] = []

    for (let n = 0; n < nMax; n++) {
      ws.saveAnswer(Number(this.check(r)))
      r = ws.getWord()
      seq.push(r)

      if (seq.slice(n - 2, n).length >= 2) {
        if (seq[n - 2] < seq[n - 1] && seq[n - 1] > seq[n]) {
          max.push({ x: n, y: seq[n - 1] })
        }

        if (seq[n - 2] > seq[n - 1] && seq[n - 1] < seq[n]) {
          min.push({ x: n, y: seq[n - 1] })
        }
      }
    }

    return { seq, min, max }
  }
}
