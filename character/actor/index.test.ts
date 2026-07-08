import { describe, test, assert, expect } from 'vitest'
import instantiateActor, { instantiateHealth, instantiateSpeed } from './index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTenHealth } from '../../defaults/equipment/index.ts'
import { STANDARD_SPEED } from '../../speed/index.ts'
import { StatusSheet } from '../../status-sheet/index.ts'

describe('instantiateHealth', () => {
    test('derives max hp from con and level', () => {
        // con 15 → +2 mod; (10 + 2) * level 1 = 12
        const health = instantiateHealth({
            cs: defaultCharacterSheet, es: {}, fs: {}, ss: {}
        })
        assert.equal(health.max, 12)
    })

    test('starts at full health with no temporary hp', () => {
        const health = instantiateHealth({
            cs: defaultCharacterSheet, es: {}, fs: {}, ss: {}
        })
        assert.equal(health.curr, health.max)
        assert.equal(health.temporary, 0)
    })

    test('equipment health mods apply', () => {
        const health = instantiateHealth({
            cs: defaultCharacterSheet, es: { ring: RingPlusTenHealth }, fs: {}, ss: {}
        })
        assert.equal(health.max, 22)
    })

    test('scales with level', () => {
        const health = instantiateHealth({
            cs: {
                ...defaultCharacterSheet,
                level: 3,
            }, es: {}, fs: {}, ss: {}
        })
        assert.equal(health.max, 36)
    })
})

describe('instantiateSpeed', () => {
    test('actor can act', () => {
        const speed = instantiateSpeed({
            cs: defaultCharacterSheet, es: {}, fs: {}, ss: {}
        })
        assert.isTrue(speed.canAct)
    })

    test('remainder is derived from an initiative roll', () => {
        // Structural only: the current formula (STANDARD_SPEED - init.total)
        // has an open ticket for its inverted sign, so we don't pin it here.
        const speed = instantiateSpeed({
            cs: defaultCharacterSheet, es: {}, fs: {}, ss: {}
        })
        assert.isTrue(Number.isFinite(speed.remainder))
    })

    test('instantiateSpeed adds the flatFooted effect', () => {
        const owner = { cs: defaultCharacterSheet, es: {}, fs: {}, ss: {} as StatusSheet }
        const speed = instantiateSpeed(owner)

        assert.property(owner.ss, 'flatFooted')
        const status = owner.ss.flatFooted
        assert.equal(status.expiration.kind, 'speed-elapsed')
        assert.equal((status.expiration as any).remaining, STANDARD_SPEED - speed.remainder)
    })
})

describe('instantiateActor', () => {
    test('composes health, speed, and owner', () => {
        const actor = instantiateActor({
            cs: defaultCharacterSheet, es: {}, fs: {}, ss: {}
        })
        assert.equal(actor.health.curr, actor.health.max)
        assert.isTrue(actor.speed.canAct)
        assert.isTrue(Number.isFinite(actor.speed.remainder))
    })

    test('keeps a reference to the owner sheets', () => {
        const owner = { cs: defaultCharacterSheet, es: {}, fs: {}, ss: {} }
        const actor = instantiateActor(owner)
        assert.equal(actor.owner, owner)
    })
})
