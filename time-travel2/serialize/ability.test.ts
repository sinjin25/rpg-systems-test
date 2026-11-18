import { addAbility, getAbilityKey } from '../../ability-sheet2'
import { resolveAbility } from '../../ability-sheet2/abilities2'
import ignite from '../../ability-sheet2/abilities2/ignite'
import { createDefaultOwner, instantiateActor } from '../../actor2'
import { actionIsAbility, applyResolutions } from '../../actor2/act'
import ability from './ability.ts'
import { describe, test, assert } from 'vitest'
import snapshotActor from './actor.ts'
import { createRoll } from '../../roll/index.ts'

describe('Integration: works with ignite', () => {
    test('Creates one log with multiple resolutions per ability use', () => {
        const ri = createRoll(0)
        const owner = createDefaultOwner()
        addAbility(owner, ignite)

        const caster = instantiateActor(owner, false, { rollInstance: ri })
        const receiver = instantiateActor(createDefaultOwner({ cs: { dex: -999 } }), false, { rollInstance: ri })

        const lookup = owner.as.standard.items[getAbilityKey(ignite)]
        assert.exists(lookup)
        // since this is a A | B issue, we need to narrow first or resolveAbility won't accept it
        // simulate2/index.ts handles this through ifs
        if (!actionIsAbility(lookup)) throw Error('look up cant be narrowed to actionIsAbility')
        actionIsAbility(lookup)

        const resolutions = resolveAbility(
            { enemy: [receiver], ally: [caster] },
            caster,
            lookup.factory(),
            { rollInstance: ri },
        )
        assert.equal(resolutions.length, 2)

        const receiverBefore = snapshotActor(receiver)
        const applied = applyResolutions(resolutions)

        const log = ability({
            source: snapshotActor(caster),
            to: applied.map(({ r }) => snapshotActor(r.target)),
            abilityId: lookup.id,
            abilityName: lookup.displayName,
            resolutions: applied,
        })

        assert.equal(log.resolutions.length, resolutions.length)

        // the always-on damage resolution records reduced health on the target
        const dmgRes = log.resolutions.find(r => r.damage && r.damage.length)
        assert.exists(dmgRes)
        assert.notEqual(receiverBefore.health.curr, dmgRes!.target.health.curr)

        // damageTaken is captured and its total matches the raw damage total
        // (no damage-taken modifiers on a default owner, so they should be equal)
        assert.exists(dmgRes!.damageTaken)
        assert.equal(dmgRes!.damageTaken!.length, dmgRes!.damage!.length)
        assert.equal(dmgRes!.damageTaken![0]!.total, dmgRes!.damage![0]!.total)

        // the failed-save resolution records the ignite status on the target
        const statusRes = log.resolutions.find(r => r.statusEffect && r.statusEffect.length)
        assert.exists(statusRes)
        assert.equal(statusRes!.type, 'failure')
        assert.exists(statusRes!.target.owner.ss['ignite'])
    })
})
