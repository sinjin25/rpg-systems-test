import { describe, test, expect, assert } from 'vitest'
import divineProtection from './divine-protection'
import acStatusMod from '../../log2/composition/status/ac-status-mod'
import { createDefaultOwner } from '../../actor2'
import { findNodeMatching } from '../../log2'
import { iterate } from '../../simulate/util/iterate'
import { inst } from '../testing'

describe('divine-protection', () => {
    test('Can take in a acBonus and duration', () => {
        const owner = createDefaultOwner({
            ss: {
                dp: [inst(divineProtection(4, 3))]
            }
        })
        const dp = owner.ss.dp![0]!
        const exp = dp.expiration
        if (exp === undefined) throw Error('expected an expiration')
        if (exp.kind !== 'rounds-elapsed') throw Error('expected kind - rounds-elapsed')
        assert.equal(exp.remaining, 3)
        const node = dp.pointer.broadContexts['ac-status-mod']
        if (!node) throw Error('expected ac-status-mod to exist')
        assert.equal(node(owner)!.total(), 4)
    })
    test('Defaults to 1d4, 1d4 for duration and range', () => {

        const set = new Set<number>()
        iterate(20, () => {
            const st = inst(divineProtection())
            // @ts-expect-error
            set.add(st.expiration.remaining)
        })
        if (set.size === 1) throw Error('divine protection did not produce a random number by default')
    })

    test('Uses ac-status-mod', () => {
        const node = acStatusMod(createDefaultOwner({ ss: { divineProtection: [inst(divineProtection(2, 2))] } }))
        expect(node.total()).toBe(2)
        const f0 = findNodeMatching(node, /divine/i)
        assert.exists(f0)
        assert.equal(f0.total(), 2)
    })
})
