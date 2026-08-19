import { describe, test, assert } from 'vitest'
import { createDefaultOwner, instantiateActor } from '../actor2'
import { leaf } from '../log2'
import { Feat2 } from '../feat2'
import addFeat from '../feat2/add-feat'
import { addStatusToStatusSheet, makeWrapper } from './index'
import { calculateDamageTicks, calculateHealTicks } from './tick'

const damageDot = makeWrapper({
    displayName: 'dot',
    broadContexts: {},
    tick: {
        calculateDamage: {
            base: () => leaf('base', 4),
            mod: () => leaf('mod', 0),
        },
    },
})

describe('calculateDamageTicks', () => {
    test('combines base + frozen mod, then applies the live target-side reduction', () => {
        const receiver = createDefaultOwner()
        const dotDefense: Feat2 = {
            displayName: 'dot-defense',
            broadContexts: { 'damage-over-time-taken-feat-mod': () => leaf('dot-defense', -1) },
        }
        addFeat(receiver, dotDefense)
        addStatusToStatusSheet(receiver, receiver, damageDot)

        const result = calculateDamageTicks(instantiateActor(receiver))
        assert.equal(result.length, 1)
        assert.equal(result[0].node.total(), 3) // 4 base - 1 taken
    })

    test('returns one result per instance under a key', () => {
        const receiver = createDefaultOwner()
        addStatusToStatusSheet(receiver, receiver, damageDot, damageDot)
        assert.equal(calculateDamageTicks(instantiateActor(receiver)).length, 2)
    })
})

describe('calculateHealTicks', () => {
    test('produces a heal node for tick.calculateHeal statuses', () => {
        const receiver = createDefaultOwner()
        const hot = makeWrapper({
            displayName: 'hot',
            broadContexts: {},
            tick: {
                calculateHeal: {
                    base: () => leaf('base', 5),
                    mod: () => leaf('mod', 0),
                },
            },
        })
        addStatusToStatusSheet(receiver, receiver, hot)

        const result = calculateHealTicks(instantiateActor(receiver))
        assert.equal(result.length, 1)
        assert.equal(result[0].node.total(), 5)
    })
})
