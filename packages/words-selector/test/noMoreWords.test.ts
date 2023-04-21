import { WordSelector } from '../src'
import { AnsweringBot } from './helpers/AnsweringBot'

describe('I can use app even if there is not possible to select word', () => {
  it('randomization is applied if range is equal of all words ', () => {
    const bot = new AnsweringBot(() => 0.5)
    const ws = new WordSelector({ rMax: 10 })
    const rMax = 1000

    const { seq } = bot.simulate(ws, rMax)
    // console.log({seq, max, min})

    expect(seq.filter((v) => v === 0).length).toStrictEqual(0)
    for (let digit = 1; digit <= 10; digit++) {
      expect(seq.filter((v) => v === digit).length / (rMax / 10)).toBeGreaterThan(0.6)
      expect(seq.filter((v) => v === digit).length / (rMax / 10)).toBeLessThan(1.4)
    }
  })
})
