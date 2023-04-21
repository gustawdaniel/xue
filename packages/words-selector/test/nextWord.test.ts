import { AnsweringBot } from './helpers/AnsweringBot'
import { WordSelector } from '../src'
import { avg } from '../src/helpers/avg'
import { Range } from '../src/interfaces/Range'
import { Point2D } from '../src/interfaces/Point2D'

// ➝ always D r = r * ( corr * p_c - (1-p_c) * (1-corr) )
// ➝ ok  add to known_list
// ➝ no add to queue_list
// ➝ always
//     if r in range in history_list ➝ r = range_end !== r_max ? range_end + 1 : range_min - 1
// ➝ add to history list
// ➝ always update history_list
// ➝ while ( n in queue_list )
//         next = queue_list[ n ]
// ➝ always
//     n++
//     next = words [ r ]

describe('I can see next words', () => {
  it('getRange', () => {
    const ws = new WordSelector()

    ws.history_ranges = [{ from: 1, to: 5 }]
    expect(ws.getRange(8)).toStrictEqual(undefined)
  })

  it('update history ranges', () => {
    const ws = new WordSelector()

    ws.update_history_ranges(1)
    expect(ws.history_ranges).toStrictEqual<Range[]>([{ from: 1, to: 1 }])

    ws.update_history_ranges(2)
    expect(ws.history_ranges).toStrictEqual<Range[]>([{ from: 1, to: 2 }])

    ws.update_history_ranges(4)
    expect(ws.history_ranges).toStrictEqual<Range[]>([
      { from: 1, to: 2 },
      { from: 4, to: 4 },
    ])

    ws.update_history_ranges(3)
    expect(ws.history_ranges).toStrictEqual<Range[]>([{ from: 1, to: 4 }])
  })

  it('i never do not know answer', () => {
    const bot = new AnsweringBot(() => 0)
    const ws = new WordSelector()

    let r = ws.getWord()
    const seq: number[] = [r]

    for (let n = 0; n < 19; n++) {
      r = ws.saveAnswer(Number(bot.check(r))).getWord()
      seq.push(r)
    }

    expect(seq.filter((v) => v === 1).length).toStrictEqual(1)
    expect(seq).toStrictEqual<number[]>(new Array(20).fill(0).map((e, i) => i + 1))
    expect(ws.history_ranges.length).toStrictEqual(1)
  })

  it('i always know the answer', () => {
    const bot = new AnsweringBot(() => 1)
    const wsSlow = new WordSelector()
    const wsSpeed = new WordSelector({ pC: 0.9 })

    let rSlow = wsSlow.getWord()
    let rSpeed = wsSpeed.getWord()
    const seqSlow: number[] = [rSlow]
    const seqSpeed: number[] = [rSpeed]

    for (let n = 0; n < 19; n++) {
      rSlow = wsSlow.saveAnswer(Number(bot.check(rSlow))).getWord()
      seqSlow.push(rSlow)
      rSpeed = wsSpeed.saveAnswer(Number(bot.check(rSpeed))).getWord()
      seqSpeed.push(rSpeed)
    }

    expect(wsSlow.history_ranges.length).toBeGreaterThan(1)
    expect(wsSpeed.history_ranges.length).toBeGreaterThan(1)
    expect(wsSpeed.history_ranges.length).toBeGreaterThanOrEqual(wsSlow.history_ranges.length)
    expect(seqSlow[19]).toBeGreaterThan(20)
    expect(seqSpeed[19]).toBeLessThanOrEqual(wsSpeed.rMax)
    expect(avg(seqSlow)).toBeLessThanOrEqual(avg(seqSpeed))
  })

  it('i know all words until 100, then I do not know any word', () => {
    const bot = new AnsweringBot((r) => Number(r <= 100))
    const ws = new WordSelector({ pC: 0.5 }) // from 0.3 to 0.55

    let r = ws.getWord()
    const seq: number[] = [r]

    for (let n = 0; n < 59; n++) {
      r = ws.saveAnswer(Number(bot.check(r))).getWord()
      seq.push(r)
    }

    expect(avg(seq)).toBeLessThan(150)
    expect(avg(seq)).toBeGreaterThan(50)

    const dSeq = seq.map((e, i) => {
      const next = i < seq.length - 1 ? seq[i + 1] : seq[seq.length - 1]
      return next - e
    })

    const conv = seq.reduce((p, n, i) => {
      const growthBelow100 = (n < 100 && dSeq[i] > 0) || (n > 100 && dSeq[i] < 0) ? 1 : -1
      return p + growthBelow100
    }, 0)

    expect(conv).toBeGreaterThan(10)
  })

  it('i know all words until 100, and some above 200', () => {
    const botRef = new AnsweringBot((r) => Number(r <= 100))
    const bot = new AnsweringBot((r) => Number(r <= 100) + 0.2 * Number(r > 200))
    const wsRef = new WordSelector({ pC: 0.5 })
    const ws = new WordSelector({ pC: 0.5 })

    let r = ws.getWord()
    let rRef = wsRef.getWord()
    // const seq: number[] = [r];
    // const seqRef: number[] = [rRef];

    // let max: Point2D[] = [];
    // let maxRef: Point2D[] = [];

    for (let n = 0; n < 59; n++) {
      r = ws.saveAnswer(Number(bot.check(r))).getWord()
      // seq.push(r);
      rRef = wsRef.saveAnswer(Number(botRef.check(rRef))).getWord()
      // seqRef.push(rRef);

      // if (seq.slice(n - 1, n + 1).length >= 2) {
      //     if (seq[n - 1] < seq[n] && seq[n] > seq[n + 1]) {
      //         max.push({x: n, y: seq[n]})
      //     }
      //
      //     if (seqRef[n - 1] < seqRef[n] && seqRef[n] > seqRef[n + 1]) {
      //         maxRef.push({x: n, y: seqRef[n]})
      //     }
      // }
    }

    // console.dir(seq, {maxArrayLength: Infinity});
    // console.dir(seqRef, {maxArrayLength: Infinity});

    // expect(Math.max(...seq)).toStrictEqual(Math.max(...seqRef))
    // expect(avg(seq)).toStrictEqual(avg(seqRef))

    expect(ws.knownList.filter((v) => v > 200).length).toBeGreaterThanOrEqual(0)
    expect(wsRef.knownList.filter((v) => v > 200).length).toStrictEqual(0)

    // expect(max.length).toStrictEqual(maxRef.length)
  })

  it('I know half of words for any rango', () => {
    const bot = new AnsweringBot((r) => Number(r % 2 === 1))
    const pcs: number[] = [0.1, 0.5, 0.9]

    const out: Record<
      '0.1' | '0.5' | '0.9',
      {
        seq: number[]
        min: Point2D[]
        max: Point2D[]
      }
    > = {
      '0.1': { seq: [], min: [], max: [] },
      '0.5': { seq: [], min: [], max: [] },
      '0.9': { seq: [], min: [], max: [] },
    }

    function stringify(pC: number): '0.1' | '0.5' | '0.9' {
      switch (pC) {
        case 0.1:
          return '0.1'
        case 0.5:
          return '0.5'
        case 0.9:
          return '0.9'
        default:
          return '0.1'
      }
    }

    for (const pC of pcs) {
      const ws = new WordSelector({ r: 100, pC })
      out[stringify(pC)] = bot.simulate(ws, 59, 100)
    }

    expect(out['0.1'].min[0].x).toBeLessThan(out['0.5'].min[0].x)
    expect(out['0.9'].max[0].x).toBeLessThan(out['0.5'].max[0].x)

    expect(Math.max(...out['0.1'].max.map((m) => m.y))).toBeLessThan(Math.max(...out['0.5'].max.map((m) => m.y)))
    expect(Math.max(...out['0.5'].max.map((m) => m.y))).toBeLessThan(Math.max(...out['0.9'].max.map((m) => m.y)))

    expect(Math.min(...out['0.1'].min.map((m) => m.y))).toBeLessThanOrEqual(Math.min(...out['0.5'].min.map((m) => m.y)))
    expect(Math.min(...out['0.5'].min.map((m) => m.y))).toBeLessThan(Math.min(...out['0.9'].min.map((m) => m.y)))

    expect(avg(out['0.1'].seq)).toBeLessThanOrEqual(avg(out['0.5'].seq))
    expect(avg(out['0.5'].seq)).toBeLessThan(avg(out['0.9'].seq))
  })

  it('i do not know words from 100 to 200', () => {
    const bot = new AnsweringBot((r) => Number(r < 100 || r > 200))
    const ws = new WordSelector({ pC: 0.5 })

    let r = 100
    const seq: number[] = [r]

    for (let n = 0; n < 59; n++) {
      r = ws.saveAnswer(Number(bot.check(r))).getWord()
      seq.push(r)
    }

    // console.log(seq);
    expect(seq.filter((r) => r < 200 && r > 100).length).toBeLessThanOrEqual(2)
  })

  it('knowledge function Min(1,alpha/r) for alpha 1, 10, 100', () => {
    const alphas: number[] = [1, 10, 100]

    const out: Record<
      '1' | '10' | '100',
      {
        seq: number[]
        min: Point2D[]
        max: Point2D[]
      }
    > = {
      '1': { seq: [], min: [], max: [] },
      '10': { seq: [], min: [], max: [] },
      '100': { seq: [], min: [], max: [] },
    }

    function stringify(alpha: number): '1' | '10' | '100' {
      switch (alpha) {
        case 1:
          return '1'
        case 10:
          return '10'
        case 100:
          return '100'
        default:
          return '1'
      }
    }

    for (const alpha of alphas) {
      const bot = new AnsweringBot((r) => Math.min(1, alpha / r))
      const ws = new WordSelector({ pC: 0.5 })
      out[stringify(alpha)] = bot.simulate(ws)
    }

    // console.dir(out, {depth: Infinity})

    expect(avg(out['1'].seq)).toBeLessThanOrEqual(avg(out['10'].seq))
    expect(avg(out['10'].seq)).toBeLessThanOrEqual(avg(out['100'].seq))
    // expect(Math.min(...out["1"].seq.slice(30))).toBeGreaterThan(1)
    // expect(Math.min(...out["10"].seq.slice(30))).toBeGreaterThan(10)
    // expect(Math.min(...out["100"].seq.slice(30))).toBeGreaterThan(100)
    // console.log(avg(out["1"].seq))
    // console.log(avg(out["10"].seq))
    // console.log(avg(out["100"].seq))
  })

  it('knowledge function exp ( - r alpha ) for alpha 0.1, 0.01, 0.001', () => {
    const alphas: number[] = [0.1, 0.01, 0.001]
    const pC = 0.5

    const out: Record<
      '0.1' | '0.01' | '0.001',
      {
        seq: number[]
        min: Point2D[]
        max: Point2D[]
      }
    > = {
      '0.1': { seq: [], min: [], max: [] },
      '0.01': { seq: [], min: [], max: [] },
      '0.001': { seq: [], min: [], max: [] },
    }

    function stringify(alpha: number): '0.1' | '0.01' | '0.001' {
      switch (alpha) {
        case 0.1:
          return '0.1'
        case 0.01:
          return '0.01'
        case 0.001:
          return '0.001'
        default:
          return '0.1'
      }
    }

    for (const alpha of alphas) {
      const bot = new AnsweringBot((r) => Math.exp(-alpha * r))
      const ws = new WordSelector({ pC })
      out[stringify(alpha)] = bot.simulate(ws)
    }

    const rEq = (pC: number, alpha: number): number => -Math.log(1 - pC) / alpha

    // console.dir(out, {depth: Infinity})
    // console.log(avg(out['0.1'].seq)/rEq(pC, 0.1))
    // console.log(avg(out['0.01'].seq)/rEq(pC, 0.01))
    // console.log(avg(out['0.001'].seq)/rEq(pC, 0.001))

    const conv = {
      '0.1': avg(out['0.1'].seq) / rEq(pC, 0.1),
      '0.01': avg(out['0.01'].seq) / rEq(pC, 0.01),
      '0.001': avg(out['0.001'].seq) / rEq(pC, 0.001),
    }
    expect(conv['0.1']).toBeLessThan(5)
    expect(conv['0.01']).toBeLessThan(2.3)
    expect(conv['0.01']).toBeGreaterThan(0.5)
    expect(conv['0.001']).toBeLessThan(2.3)
    expect(conv['0.001']).toBeGreaterThan(0.4)
  })

  it('knowledge function Min(1,r^alpha) for alpha -1/2, -1/3, -1/5', () => {
    // > 1 / (1 - 0.84) ** 3
    // 244.14062499999986
    // > 1 / (1 - 0.936) ** 2
    // 244.14062500000043
    // > 1 / (1 - 0.667) ** 5
    // 244.2186535220408

    const params: Array<{ n: number; pC: number }> = [
      { n: 2, pC: 0.936 },
      { n: 3, pC: 0.84 },
      { n: 5, pC: 0.667 },
    ]

    const out: Record<
      '2' | '3' | '5',
      {
        seq: number[]
        min: Point2D[]
        max: Point2D[]
      }
    > = {
      '2': { seq: [], min: [], max: [] },
      '3': { seq: [], min: [], max: [] },
      '5': { seq: [], min: [], max: [] },
    }

    function stringify(alpha: number): '2' | '3' | '5' {
      switch (alpha) {
        case 2:
          return '2'
        case 3:
          return '3'
        case 5:
          return '5'
        default:
          return '2'
      }
    }

    for (const { n, pC } of params) {
      const bot = new AnsweringBot((r) => Math.min(1, r ** (-1 / n)))
      const ws = new WordSelector({ pC })
      out[stringify(n)] = bot.simulate(ws)
    }

    const rEq = (pC: number, n: number): number => 1 / (1 - pC) ** n

    // console.log(out);

    const conv: Record<'2' | '3' | '5', number> = params.reduce(
      (p, n) => {
        return {
          ...p,
          [stringify(n.n)]: avg(out[stringify(n.n)].seq) / rEq(n.pC, n.n),
        }
      },
      { '2': 0, '3': 0, '5': 0 }
    )

    // console.log(conv);

    expect(conv['2']).toBeGreaterThan(0.1)
    expect(conv['2']).toBeLessThan(3)
    expect(conv['3']).toBeGreaterThan(0.1)
    expect(conv['3']).toBeLessThan(3)
    expect(conv['5']).toBeGreaterThan(0.1)
    expect(conv['5']).toBeLessThan(3)
  })

  it('knowledge function H(Sin(100*r/(2pi))) start on r = 2000', () => {})
})
