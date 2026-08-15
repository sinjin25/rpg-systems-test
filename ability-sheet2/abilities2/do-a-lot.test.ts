import { createDefaultOwner, instantiateActor } from '../../actor2'
import { resolveAbility } from './index.ts'
import doALot from './do-a-lot.ts'
import { describe, test, assert, afterEach } from 'vitest'
import { clearSeed, setSeed } from '../../roll/index.ts'

describe('resolveAbility: doALot', () => {
    afterEach(() => {
        clearSeed()
    })

    test('resolves every step against its own targets', () => {
        setSeed(0)
        const caster = instantiateActor(createDefaultOwner())
        const ally = instantiateActor(createDefaultOwner())
        const e1 = instantiateActor(createDefaultOwner())
        const e2 = instantiateActor(createDefaultOwner())

        const resolutions = resolveAbility(
            { enemy: [e1, e2], ally: [caster, ally] },
            caster,
            doALot.factory(),
        )

        // selfTarget: 1 ally  x 1 payload = 1
        // targetFirst: 1 enemy x 2 payloads = 2
        // splash:      2 enemy x 1 payload = 2
        assert.equal(resolutions.length, 5)

        // the self step heals
        assert.exists(resolutions.find(r => r.heal && r.heal.length))
        // the will save on the first enemy carries dc + save rolls
        assert.exists(resolutions.find(r => r.saveType === 'will' && r.dc && r.save))
    })
})
