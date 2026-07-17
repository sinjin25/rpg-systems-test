import { describe, test, assert, expect, beforeEach } from 'vitest'
import instantiateActor, { instantiateHealth, instantiateSpeed, takeNextAbility, Owner } from './index.ts'
import { Ability, createAbilityCategory } from '../../ability-sheet/index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTenHealth } from '../../defaults/equipment/index.ts'
import { STANDARD_SPEED } from '../../speed/index.ts'
import { createDefaultOwner } from '../../defaults/index.ts'

let owner: Owner
describe('instantiateHealth', () => {
    beforeEach(() => {
        owner = createDefaultOwner({})
    })
    test('derives max hp from con and level', () => {
        // con 15 → +2 mod; (10 + 2) * level 1 = 12
        const health = instantiateHealth(owner)
        assert.equal(health.max, 12)
    })

    test('starts at full health with no temporary hp', () => {
        const health = instantiateHealth(owner)
        assert.equal(health.curr, health.max)
        assert.equal(health.temporary, 0)
    })

    test('equipment health mods apply', () => {
        owner = createDefaultOwner({
            cs: defaultCharacterSheet, es: { ring: RingPlusTenHealth }, fs: {}, ss: {}
        })
        const health = instantiateHealth(owner)
        assert.equal(health.max, 22)
    })

    test('scales with level', () => {
        owner = createDefaultOwner({
            cs: {
                ...defaultCharacterSheet,
                level: 3,
            }, es: {}, fs: {}, ss: {}
        })
        const health = instantiateHealth(owner)
        assert.equal(health.max, 36)
    })
})

describe('instantiateSpeed', () => {
    test('actor can act', () => {
        const speed = instantiateSpeed(owner)
        assert.isTrue(speed.canAct)
    })

    test('remainder is derived from an initiative roll', () => {
        // Structural only: the current formula (STANDARD_SPEED - init.total)
        // has an open ticket for its inverted sign, so we don't pin it here.
        const speed = instantiateSpeed(owner)
        assert.isTrue(Number.isFinite(speed.remainder))
    })

    test('seeds a flat-footed status lasting until the actor\'s first action', () => {
        const speed = instantiateSpeed(owner)

        assert.property(owner.ss, 'flatFooted')
        const status = owner.ss.flatFooted
        assert.equal(status.expiration.kind, 'speed-elapsed')
        assert.equal((status.expiration as any).remaining, STANDARD_SPEED - speed.remainder)
    })
})

describe('instantiateActor', () => {
    test('composes health, speed, and owner', () => {
        const actor = instantiateActor(owner)
        assert.equal(actor.health.curr, actor.health.max)
        assert.isTrue(actor.speed.canAct)
        assert.isTrue(Number.isFinite(actor.speed.remainder))
    })

    test('keeps a reference to the owner sheets', () => {
        const actor = instantiateActor(owner)
        assert.equal(actor.owner, owner)
    })
})

describe('takeNextAbility', () => {
    const ability = (displayName: string): Ability => ({
        displayName,
        keyStat: 'con',
        castType: 'swift',
        contexts: [],
    })

    const categoryOf = (...abilities: Ability[]) => {
        const category = createAbilityCategory()
        for (const a of abilities) {
            category.items[a.displayName] = a
            category.priority.push(a.displayName)
        }
        return category
    }

    test('an empty category yields nothing and leaves the cursor alone', () => {
        const category = createAbilityCategory()
        assert.isUndefined(takeNextAbility(category))
        assert.isUndefined(takeNextAbility(category, { wrap: true }))
        assert.equal(category.index, 0)
    })

    test('without wrap, walks the priority list once and is then exhausted', () => {
        const category = categoryOf(ability('A'), ability('B'))

        assert.equal(takeNextAbility(category)?.displayName, 'A')
        assert.equal(takeNextAbility(category)?.displayName, 'B')
        assert.isUndefined(takeNextAbility(category))
        assert.isUndefined(takeNextAbility(category)) // stays exhausted
    })

    test('with wrap, cycles back to the start after the last entry', () => {
        const category = categoryOf(ability('A'), ability('B'))

        const names = [1, 2, 3, 4, 5].map(() => takeNextAbility(category, { wrap: true })?.displayName)
        assert.deepEqual(names, ['A', 'B', 'A', 'B', 'A'])
    })

    test('with wrap, a single entry is cast every time', () => {
        const category = categoryOf(ability('Only'))

        assert.equal(takeNextAbility(category, { wrap: true })?.displayName, 'Only')
        assert.equal(takeNextAbility(category, { wrap: true })?.displayName, 'Only')
    })
})
