import { describe, test, assert } from 'vitest'
import { createDefaultOwner, instantiateActor } from '../../actor2'
import { addStatusToStatusSheet, getStatusKey } from '..'
import { calculateDamageTicks } from '../tick'
import burningWeaponStatus from './burning-weapon'

describe('burning weapon', () => {
    test('applies with a reflex save-succeeded expiration', () => {
        const receiver = createDefaultOwner()
        addStatusToStatusSheet(receiver, createDefaultOwner(), burningWeaponStatus)

        const inst = receiver.ss[getStatusKey(burningWeaponStatus)]![0]!
        assert.equal(inst.expiration?.kind, 'save-succeeded')
        assert.equal(inst.expiration?.kind === 'save-succeeded' && inst.expiration.saveType, 'reflex')
    })

    test('ticks 1d4 damage on the receiver', () => {
        const receiver = createDefaultOwner()
        addStatusToStatusSheet(receiver, createDefaultOwner(), burningWeaponStatus)

        const total = calculateDamageTicks(instantiateActor(receiver))[0].node.total()
        assert.isTrue(total >= 1 && total <= 4)
    })
})
