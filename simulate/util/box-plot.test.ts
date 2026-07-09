import { describe, test, assert } from 'vitest'
import { boxPlotStats } from './box-plot.ts'

describe('boxPlotStats', () => {
    test('computes min, quartiles, median, max, mean for an odd-length dataset', () => {
        const stats = boxPlotStats([1, 2, 3, 4, 5])

        assert.equal(stats.min, 1)
        assert.equal(stats.q1, 2)
        assert.equal(stats.median, 3)
        assert.equal(stats.q3, 4)
        assert.equal(stats.max, 5)
        assert.equal(stats.mean, 3)
    })

    test('interpolates quartiles for an even-length dataset', () => {
        const stats = boxPlotStats([1, 2, 3, 4])

        assert.equal(stats.min, 1)
        assert.equal(stats.q1, 1.75)
        assert.equal(stats.median, 2.5)
        assert.equal(stats.q3, 3.25)
        assert.equal(stats.max, 4)
    })

    test('does not mutate the input array', () => {
        const values = [3, 1, 2]
        boxPlotStats(values)
        assert.deepEqual(values, [3, 1, 2])
    })

    test('handles a single value', () => {
        const stats = boxPlotStats([7])

        assert.equal(stats.min, 7)
        assert.equal(stats.q1, 7)
        assert.equal(stats.median, 7)
        assert.equal(stats.q3, 7)
        assert.equal(stats.max, 7)
        assert.equal(stats.mean, 7)
    })

    test('throws on empty input', () => {
        assert.throws(() => boxPlotStats([]))
    })
})
