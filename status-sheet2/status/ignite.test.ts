import { describe, test, assert } from 'vitest'
import { createDefaultOwner, instantiateActor } from '../../actor2'
import { leaf } from '../../log2'
import { Feat2 } from '../../feat2'
import addFeat from '../../feat2/add-feat'
import { addStatusToStatusSheet } from '..'
import { calculateDamageTicks } from '../tick'
import ignite from './ignite'

describe('ignite', () => {
    test('ticks 1d4 damage on the receiver', () => {
        const receiver = createDefaultOwner()
        addStatusToStatusSheet(receiver, createDefaultOwner(), ignite)

        const result = calculateDamageTicks(instantiateActor(receiver))
        assert.equal(result.length, 1)
        const total = result[0].node.total()
        assert.isTrue(total >= 1 && total <= 4)
    })

    test('freezes the source damage-over-time bonus at apply time', () => {
        const source = createDefaultOwner()
        const dotPlus: Feat2 = {
            displayName: 'dot-plus',
            broadContexts: { 'damage-over-time-feat-mod': () => leaf('dot-plus', 10) },
        }
        addFeat(source, dotPlus)

        const receiver = createDefaultOwner()
        addStatusToStatusSheet(receiver, source, ignite)

        const total = calculateDamageTicks(instantiateActor(receiver))[0].node.total()
        assert.isTrue(total >= 11 && total <= 14) // 1d4 + frozen +10 from source
    })
})
