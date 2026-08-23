import { describe, test, assert } from 'vitest'
import { createDefaultOwner, instantiateActor } from '../../actor2'
import { act, actionIsAbility, actionIsAttackAbility, applyAttackResolutions, calculateAc, FinalStandardActionResult, outputRawSar, sarAgainstTarget } from '../../actor2/act'
import { addAbility } from '../../ability-sheet2'
import { setSeed, clearSeed } from '../../roll'
import { resolveAttackAbility } from './index'
import normalAttack from './normal-attack'
import { iterate } from '../../simulate/util/iterate'

describe('normal attack (AttackAbility)', () => {
    test('is registered, selected by act(), and routed by the attack guard', () => {
        const owner = createDefaultOwner()
        addAbility(owner, normalAttack)
        const actor = instantiateActor(owner)

        const actions = act(actor)
        const attackDefs = actions.filter(actionIsAttackAbility)

        assert.equal(attackDefs.length, 1)
        assert.equal(attackDefs[0]!.displayName, 'normal attack')
        assert.isFalse(actions.some(actionIsAbility)) // not mistaken for a save ability
    })

    test('Is literally a normal attack', () => {
        const LEN = 20
        const attacks: any[] = []
        const attacksAsAbility: any[] = []

        // a FinalStandardActionResult is a tree of ModNodes (closures), so it can't be deep-equaled
        // directly. Reduce it to a plain snapshot of which nodes are present and each one's total.
        const summarize = (f: FinalStandardActionResult) => ({
            keys: Object.keys(f).sort().join(','),
            slot: f.relevantSlot?.displayName,
            attack: f.attackResult?.total(),
            ac: f.acResult?.total(),
            threat: f.threatResult?.total(),
            critConfirm: f.critConfirmResult?.total(),
            damage: f.damageResult?.total(),
            critDamage: f.critDamageResult?.total(),
        })

        const attacker = createDefaultOwner()
        const attacked = createDefaultOwner()
        const attackerA = instantiateActor(attacker)
        const AttackedA = instantiateActor(attacked)

        // iterate re-seeds to `seed` before each call, so pass i drives both loops identically
        iterate(LEN, () => {
            // raw standard action, resolved by hand
            const sar = outputRawSar(attackerA)[0]!
            const final = sarAgainstTarget(sar, calculateAc(AttackedA.owner))
            attacks.push(summarize(final))
        })
        iterate(LEN, () => {
            // the same attack, dispatched through the ability path
            const [res] = resolveAttackAbility(
                { enemy: [AttackedA], ally: [attackerA] },
                attackerA,
                normalAttack.factory(),
            )
            attacksAsAbility.push(summarize(res!.sar))
        })

        assert.equal(attacks.length, attacksAsAbility.length)
        for (let i = 0; i < attacks.length; i++) {
            const atk = attacks[i]
            const atkAsAbility = attacksAsAbility[i]
            // same seed in, same attack out - identical down to every node total
            assert.deepEqual(atk, atkAsAbility)
        }
    })

    test('lands weapon damage on the first enemy and leaves the caster untouched', () => {
        // seed-fish a hit (a bare payload has no augment to force one), mirroring index.test.ts
        let applied = false
        for (let seed = 0; seed < 200 && !applied; seed++) {
            setSeed(seed)
            const caster = instantiateActor(createDefaultOwner())
            const enemy = instantiateActor(createDefaultOwner())
            const enemyHpBefore = enemy.health.curr
            const casterHpBefore = caster.health.curr

            const resolutions = resolveAttackAbility(
                { enemy: [enemy], ally: [caster] },
                caster,
                normalAttack.factory(),
            )
            assert.equal(resolutions.length, 1)
            assert.equal(resolutions[0]!.target, enemy)

            if (resolutions[0]!.hook === 'onMiss') continue

            applyAttackResolutions(resolutions)
            assert.isBelow(enemy.health.curr, enemyHpBefore) // weapon damage from the SAR
            assert.equal(caster.health.curr, casterHpBefore)
            applied = true
        }
        clearSeed()
        assert.isTrue(applied, 'expected at least one hitting seed in [0,200)')
    })
})
