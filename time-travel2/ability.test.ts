import { addAbility, getAbilityKey, resolveAbility } from '../ability-sheet2'
import ignite from '../ability-sheet2/abilities2/ignite'
import { createDefaultOwner, instantiateActor } from '../actor2'
import { applyResolutions } from '../actor2/act'
import ability from './ability.ts'
import { describe, test, assert, afterEach } from 'vitest'
import snapshotActor from './snapshot/actor.ts'
import { clearSeed, setSeed } from '../roll/index.ts'

describe('Integration: works with ignite', () => {
    afterEach(() => {
        clearSeed()
    })
    test('Can create multiple logs per singular ability', () => {
        setSeed(0)
        const owner = createDefaultOwner()
        addAbility(owner, ignite)

        const caster = instantiateActor(owner)
        const receiver = instantiateActor(createDefaultOwner({ cs: { dex: -999 } }))

        const ign = owner.as.standard.items[getAbilityKey(ignite)]
        assert.exists(ign)

        const resolutions = resolveAbility(
            { enemy: [receiver], ally: [caster] },
            caster,
            ign!.factory(),
        )
        assert.equal(resolutions.length, 2)

        const receiverBefore = snapshotActor(receiver)
        const logs: Array<ReturnType<typeof ability>> = []

        for (let r of resolutions) {
            applyResolutions([r])
            logs.push(ability({
                source: snapshotActor(caster),
                to: [snapshotActor(r.target)],
                resolution: r,
            }))
        }

        assert.equal(logs.length, 2)

        // the always-on damage log records reduced health on the target
        const dmgLog = logs.find(l => l.damage && l.damage.length)
        assert.exists(dmgLog)
        assert.notEqual(receiverBefore.health.curr, dmgLog!.to![0]!.health.curr)

        // the failed-save log records the ignite status on the target
        const statusLog = logs.find(l => l.statusEffect && l.statusEffect.length)
        assert.exists(statusLog)
        assert.equal(statusLog!.type, 'failure')
        assert.exists(statusLog!.to![0]!.owner.ss['ignite'])
    })
})
