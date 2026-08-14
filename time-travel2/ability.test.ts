import { addAbility, getAbilityKey } from '../ability-sheet2'
import ignite from '../ability-sheet2/abilities/ignite'
import { createDefaultOwner, instantiateActor } from '../actor2'
import { generateAbilityModNodes, handleAbilityModNodes } from '../actor2/act'
import ability from './ability.ts'
import { describe, test, assert, expect, afterEach } from 'vitest'
import snapshotActor from './snapshot/actor.ts'
import { clearSeed, setSeed } from '../roll/index.ts'

describe('Integration: works with ignite', () => {
    afterEach(() => {
        clearSeed()
    })
    test('Can create multiple events per singular ability', () => {
        setSeed(0)
        const owner = createDefaultOwner()
        addAbility(
            owner,
            ignite
        )

        const actor1 = instantiateActor(owner)
        const actor2 = instantiateActor(owner)

        const ign = owner.as.standard.items[getAbilityKey(ignite)]
        assert.exists(ign)

        const gamn = generateAbilityModNodes(owner, actor2.owner, ign)

        const logs: Array<ReturnType<typeof ability>> = []

        const actor1Snapshot = snapshotActor(actor1)

        for (let g of gamn) {
            handleAbilityModNodes(actor1, actor2, [g])
            // create log
            const ab = ability({
                source: snapshotActor(actor1),
                to: [snapshotActor(actor2)],
                abilityModNode: g,
            })
            logs.push(ab)
        }
        const log0ActorSnap = logs[0]!.to[0]!
        const log1ActorSnap = logs[1]!.to[0]!
        assert.equal(logs.length, 2)
        // the onUse damage happens
        assert.notEqual(actor1Snapshot.health.curr, log0ActorSnap.health.curr)
        // the status effect happens
        assert.equal(log0ActorSnap.health.curr, log1ActorSnap.health.curr)

        // status effect was not handled at this point
        assert.notExists(
            log0ActorSnap.owner.ss['ignite']
        )
        // status effect was handled at this point
        assert.exists(
            log1ActorSnap.owner.ss['ignite']
        )
    })
})