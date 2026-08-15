import { createDefaultOwner, instantiateActor } from '..'
import ignite from '../../ability-sheet2/abilities2/ignite.ts'
import { addAbility, resolveAbility } from '../../ability-sheet2/index.ts'
import { findNodeMatching } from '../../log2/index.ts'
import { clearSeed, setSeed } from '../../roll/index.ts'
import { applyResolutions, selectAndPrepAbility } from './ability.ts'
import { describe, test, assert, afterEach } from 'vitest'

describe('resolveAbility + applyResolutions', () => {
    afterEach(() => {
        clearSeed()
    })

    test('integration: ignite deals damage and, on a failed save, applies the ignite status', () => {
        setSeed(0)
        const caster = instantiateActor(createDefaultOwner())
        const receiver = instantiateActor(createDefaultOwner({ cs: { dex: -999 } }))

        assert.notExists(receiver.owner.ss['ignite'])
        assert.equal(receiver.health.max, receiver.health.curr)

        const resolutions = resolveAbility(
            { enemy: [receiver], ally: [caster] },
            caster,
            ignite.factory(),
        )
        applyResolutions(resolutions)

        // always-on damage landed
        assert(receiver.health.curr < receiver.health.max)
        // failed the reflex save -> caught fire
        assert.exists(receiver.owner.ss['ignite'])
    })

    test('a dc payload carries the dc and save rolls for logging', () => {
        const caster = instantiateActor(createDefaultOwner())
        const receiver = instantiateActor(createDefaultOwner({ cs: { dex: -999 } }))

        const resolutions = resolveAbility(
            { enemy: [receiver], ally: [caster] },
            caster,
            ignite.factory(),
        )
        // the second payload is the reflex-save status
        const saveRes = resolutions.find(r => r.dc && r.save)
        assert.exists(saveRes)
        assert.equal(saveRes!.type, 'failure')

        const f0 = findNodeMatching(saveRes!.dc!, /dc/, { includeRoot: true })
        const f1 = findNodeMatching(saveRes!.save!, /(reflex)|(fortitude)|(will)/, { includeRoot: true })
        assert.exists(f0)
        assert.exists(f1)
    })

    test('on a successful save the status is not applied but damage still lands', () => {
        setSeed(0)
        const caster = instantiateActor(createDefaultOwner())
        const receiver = instantiateActor(createDefaultOwner({ cs: { dex: 999 } }))

        const resolutions = resolveAbility(
            { enemy: [receiver], ally: [caster] },
            caster,
            ignite.factory(),
        )
        applyResolutions(resolutions)

        assert(receiver.health.curr < receiver.health.max)
        assert.notExists(receiver.owner.ss['ignite'])
    })
})

describe('integration: selectAndPrepAbility', () => {
    test('When there are no abilities, returns undefined', () => {
        const ownerA = instantiateActor(createDefaultOwner())

        assert.isUndefined(selectAndPrepAbility(ownerA, 'swift'))
        assert.isUndefined(selectAndPrepAbility(ownerA, 'standard'))
        assert.isUndefined(selectAndPrepAbility(ownerA, 'free'))
    })
    test('When you have an ability, returns the stored definition', () => {
        const owner = createDefaultOwner()
        addAbility(owner, ignite)

        const ownerA = instantiateActor(owner)
        const standard = selectAndPrepAbility(ownerA, 'standard')
        assert.exists(standard)
        assert.equal(standard!.displayName, ignite.displayName)

        const standard2 = selectAndPrepAbility(ownerA, 'standard')

        assert.equal(standard, standard2)
    })
    test('Does not advance the picker alone', () => {
        const owner = createDefaultOwner()
        addAbility(owner, ignite)
        const ownerA = instantiateActor(owner)

        for (let a in [0, 1, 2, 3, 4]) {
            const result = selectAndPrepAbility(ownerA, 'standard')
            assert.exists(result)
        }
    })
})
