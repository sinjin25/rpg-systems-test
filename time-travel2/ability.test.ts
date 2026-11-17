import { addAbility, getAbilityKey } from '../ability-sheet2'
import { resolveAbility } from '../ability-sheet2/abilities2'
import ignite from '../ability-sheet2/abilities2/ignite'
import { createDefaultOwner, instantiateActor } from '../actor2'
import { actionIsAbility, applyResolutions } from '../actor2/act'
import ability from './ability.ts'
import { describe, test, assert } from 'vitest'
import snapshotActor from './serialize/actor.ts'
import { createRoll } from '../roll/index.ts'

describe('Integration: works with ignite', () => {
    test('Can create multiple logs per singular ability', () => {
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
        const logs: Array<ReturnType<typeof ability>> = []

        for (let { r, damageTaken } of applyResolutions(resolutions)) {
            logs.push(ability({
                source: snapshotActor(caster),
                to: [snapshotActor(r.target)],
                resolution: r,
                damageTaken,
            }))
        }

        assert.equal(logs.length, 2)

        // the always-on damage log records reduced health on the target
        const dmgLog = logs.find(l => l.damage && l.damage.length)
        assert.exists(dmgLog)
        assert.notEqual(receiverBefore.health.curr, dmgLog!.to![0]!.health.curr)

        // damageTaken is captured and its total matches the raw damage total
        // (no damage-taken modifiers on a default owner, so they should be equal)
        assert.exists(dmgLog!.damageTaken)
        assert.equal(dmgLog!.damageTaken!.length, dmgLog!.damage!.length)
        assert.equal(dmgLog!.damageTaken![0]!.total, dmgLog!.damage![0]!.total)

        // the failed-save log records the ignite status on the target
        const statusLog = logs.find(l => l.statusEffect && l.statusEffect.length)
        assert.exists(statusLog)
        assert.equal(statusLog!.type, 'failure')
        assert.exists(statusLog!.to![0]!.owner.ss['ignite'])
    })
})
