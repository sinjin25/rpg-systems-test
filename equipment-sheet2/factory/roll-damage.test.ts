import { describe, test, expect, assert } from 'vitest'
import { buildDamageBroadContext, buildRollDamageModBroadContext, collectRollDamageSources } from './roll-damage'
import { createDefaultOwner } from '../../actor2'
import { EquipmentBlueprint } from './types'
import { RollInstance } from '../../roll/types'
import { createRoll } from '../../roll'
import { iterate } from '../../simulate/util/iterate'
import modNodeToText from '../../log2/format'
import { findNodeMatching, leaf } from '../../log2'

describe('buildDamageBroadContext', () => {
    test.skip('eyeball - produce ModNode', () => {
        iterate(10, (s) => {
            const owner = createDefaultOwner()
            const broadContextHandler = buildDamageBroadContext('test weapon', 8)
            const rollInstance = createRoll(s)

            const first = broadContextHandler(owner, { rollInstance })
            const second = broadContextHandler(owner, { rollInstance })

            /* console.log('mytest')
            console.log(modNodeToText(first!))
            console.log(modNodeToText(second!)) */
        })
    })
    test('Can generate new ', () => {
        const owner = createDefaultOwner()
        const broadContextHandler = buildDamageBroadContext('test weapon', 8)
        const rollInstance = createRoll(1)

        const first = broadContextHandler(owner, { rollInstance })
        const second = broadContextHandler(owner, { rollInstance })

        expect(first!.total()).toBe(6)
        expect(second!.total()).toBe(1)
    })
})

describe('buildRollDamageModBroadContext', () => {
    test('rolls independently, feats can affect through damage-sides-mod', () => {
        const owner = createDefaultOwner({
            fs: {
                damageSidesPlus: {
                    displayName: 'damage-sides-plus',
                    broadContexts: {
                        "damage-sides-mod": () => leaf('damage-sides-plus', 2)
                    }
                }
            }
        })
        const sources = [
            { label: 'roll-damage implicit', sides: 6 },
            { label: 'roll-damage T1', sides: 4 }
        ]
        const modFn = buildRollDamageModBroadContext('test weapon', sources)

        const ri = createRoll(1)
        const first = modFn(owner, { rollInstance: ri })


        const second = modFn(owner, { rollInstance: ri })

        assert.exists(first)
        assert.exists(second)
        expect(first.total()).toBe(7)
        expect(second.total()).toBe(11)
        expect(first.total()).not.toBe(second.total())

        const t1 = findNodeMatching(first, /roll-damage T1/)
        const implicit = findNodeMatching(first, /roll-damage implicit/)
        assert.exists(implicit)
        assert.exists(t1)

        const implicitBaseSides = findNodeMatching(implicit, /original/)
        assert.exists(implicitBaseSides)
        assert.equal(implicitBaseSides.total(), 6)

        const nodeDamageSides = findNodeMatching(implicit, /damage-sides-mod/)
        assert.exists(nodeDamageSides)
        assert.equal(nodeDamageSides.total(), 2)

        /* console.log(modNodeToText(first)) */
    })
})

describe('collectRollDamageSources', () => {
    test('combines implicit and affix/suffix roll-damage entries, ignoring other kinds', () => {
        const blueprint: EquipmentBlueprint = {
            slot: 'mainhand',
            base: {
                name: 'test weapon',
                base: { displayName: 'test weapon', acceptableSlots: ['mainhand'], broadContexts: {} },
                implicit: [{ kind: 'roll-damage', value: 6 }, { kind: 'attack', value: 3 }],
            },
            // mainhand affix roll-damage rank 1 is {min: 4, max: 10} — perfection 0 lands on min (4)
            affix: [{ kind: 'roll-damage', rank: 1, perfection: 0 }, { kind: 'attack', rank: 0, perfection: 0 }],
            suffix: [],
        }

        const sources = collectRollDamageSources('mainhand', blueprint)

        expect(sources).toEqual([
            { label: 'roll-damage T1', sides: 4 },
            { label: 'roll-damage implicit', sides: 6 },
        ])
    })

    test('returns an empty list when there is nothing to roll', () => {
        const blueprint: EquipmentBlueprint = { slot: 'mainhand', affix: [], suffix: [] }

        expect(collectRollDamageSources('mainhand', blueprint)).toEqual([])
    })
})
