import { describe, test, assert } from 'vitest'
import { createDefaultOwner, instantiateActor } from '..'
import { addAbility, resolveAttackAbility, AttackAbility, AttackAbilitySheetDefinition } from '../../ability-sheet2'
import { leaf } from '../../log2'
import { setSeed, clearSeed } from '../../roll'
import { act, actionIsAbility, actionIsAttackAbility, applyAttackResolutions } from './index'

// a standard-action attack ability that strikes the first enemy; +100 to-hit guarantees a landing
// (nat-1 aside), so damage is deterministic enough to seed-fish quickly
const makeAttackDef = (): AttackAbilitySheetDefinition => ({
    kind: 'attack',
    castType: 'standard',
    displayName: 'test-strike',
    factory: (): AttackAbility => ({
        steps: [{
            tp: { filters: [], simple: 'first', team: 'enemy' },
            payload: [{
                augments: { attackResult: { mod: leaf('sure-hit', 100) } },
                onHit: () => ({}),
            }],
        }],
    }),
})

describe('attack ability registration + routing', () => {
    test('a registered attack ability is selected by act() and routed by the guards', () => {
        const owner = createDefaultOwner()
        addAbility(owner, makeAttackDef())
        const actor = instantiateActor(owner)

        const actions = act(actor)
        const attackDefs = actions.filter(actionIsAttackAbility)

        assert.equal(attackDefs.length, 1)
        assert.equal(attackDefs[0]!.displayName, 'test-strike')
        // and it is NOT mistaken for a save ability
        assert.isFalse(actions.some(actionIsAbility))
    })
})

describe('resolveAttackAbility + applyAttackResolutions', () => {
    test('lands weapon damage on the enemy and leaves the caster untouched', () => {
        // find a seed that actually hits (not a nat-1), then apply on fresh actors under it
        let applied = false
        for (let seed = 0; seed < 100 && !applied; seed++) {
            setSeed(seed)
            const caster = instantiateActor(createDefaultOwner())
            const enemy = instantiateActor(createDefaultOwner())
            const enemyHpBefore = enemy.health.curr
            const casterHpBefore = caster.health.curr

            const resolutions = resolveAttackAbility(
                { enemy: [enemy], ally: [caster] },
                caster,
                makeAttackDef().factory(),
            )
            assert.equal(resolutions.length, 1)

            if (resolutions[0]!.hook === 'onMiss') continue // nat-1, try next seed

            applyAttackResolutions(resolutions)
            assert.isBelow(enemy.health.curr, enemyHpBefore) // weapon damage came from the SAR
            assert.equal(caster.health.curr, casterHpBefore) // an attack ability doesn't hurt the caster
            applied = true
        }
        clearSeed()
        assert.isTrue(applied, 'expected at least one hitting seed in [0,100)')
    })
})
