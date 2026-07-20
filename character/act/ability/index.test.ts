import { characterLevels } from '../../../character-sheet/class-level'
import { describe, test, assert } from 'vitest'

import { useAbility } from './index.ts'
import { Ability } from '../../../ability-sheet/index.ts'
import ignite from '../../../ability-sheet/abilities/ignite.ts'
import { defaultFeatSheet } from '../../../feat/index.ts'
import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'
import { util_findModLogGroupItem } from '../../../stat-modifier/log/index.ts'

const baseData = (overrides?: Partial<Parameters<typeof useAbility>[0]>) => ({
    cs: { con: 14, dex: 10, str: 10, levels: characterLevels(1) },
    es: {},
    fs: defaultFeatSheet,
    ss: {},
    ability: ignite,
    ...overrides,
})

const testAbility = (overrides?: Partial<Ability>): Ability => ({
    displayName: 'test ability',
    keyStat: 'con',
    castType: 'standard',
    contexts: ['magic'],
    damage: () => 7,
    save: { type: 'reflex', baseDc: 12, damageOnPass: 'half' },
    ...overrides,
})

describe('useAbility structure', () => {
    test('Logs: equipment supports dc BroadContext and contexts', () => {
        const dcWand = createEquipment({
            displayName: 'dc wand',
            mods: { dc: { whitelist: ['magic'], mod: 2 } },
        })
        const meleeRing = createEquipment({
            displayName: "melee dc ring",
            mods: { dc: { whitelist: ['melee'], mod: 5 } },
        })

        const result = useAbility(baseData({ es: { amulet: dcWand, ring: meleeRing } }))

        const EXPECTED_TOTAL = 19
        const EXPECTED_BASE_DC = 15
        // baseDc 15 + con (+2) + dc wand (+2) = 19; ring does not apply (no context)
        assert.equal(result.save?.dc, EXPECTED_TOTAL)

        // LOG CHECK
        const modLog = result.save!.dcLog
        const base = util_findModLogGroupItem(modLog, {
            groupName: 'base dc',
            modDisplayName: 'base dc'
        })
        assert.equal(base?.amount, EXPECTED_BASE_DC)

        const eq = util_findModLogGroupItem(modLog, {
            groupName: 'equipment mod',
            modDisplayName: 'dc wand'
        })
        assert.equal(eq?.amount, 2)
        const not = util_findModLogGroupItem(modLog, {
            groupName: 'equipment mod',
            modDisplayName: 'melee dc ring'
        })
        assert.notExists(not)
    })

    test('DC has no roll component. However, modlog requires it', () => {
        const result = useAbility(baseData())
        assert.equal(result.save?.dcLog.finalResult().roll, 0)
    })
})

describe('useAbility produces a final DC', () => {
    test('DC is the ability baseDc + its keyStat mod', () => {
        const result = useAbility(baseData({ cs: { con: 14, dex: 20, str: 20, levels: characterLevels(1) } }))

        // ignite baseDc 15 + con 14 (+2) = 17; the high dex/str are ignored
        assert.equal(result.save?.dc, 17)
        assert.equal(result.save?.type, 'reflex')

        // dc is a getter derived from the log total
        assert.equal(result.save?.dcLog.finalResult().total, result.save?.dc)
    })

    test('You can pass modified dcs to statuses that are factories', () => {
        const result = useAbility(baseData())

        const status = result.ability.onFailedSave!(result.save!.dc)
        assert.deepEqual(status.expiration, {
            kind: 'save-succeeded',
            saveType: 'reflex',
            dc: result.save!.dc,
        })
    })
})

describe('useAbility can produce damage', () => {
    test('damage BroadContext applies', () => {
        const flamingOrb = createEquipment({
            displayName: 'flaming orb',
            mods: { damage: { whitelist: ['magic'], mod: 2 } },
        })
        const meleeCharm = createEquipment({
            displayName: 'melee charm',
            mods: { damage: { whitelist: ['melee'], mod: 5 } },
        })

        const result = useAbility(baseData({
            ability: testAbility(),
            es: { amulet: flamingOrb, ring: meleeCharm },
        }))

        // base 7 + flaming orb (+2) = 9; melee charm does not apply
        assert.equal(result.damage?.damageRoll, 9)
        const found = util_findModLogGroupItem(result.damage!.damageLog, {
            groupName: 'equipment mod', modDisplayName: 'flaming orb',
        })
        assert.exists(found)
    })

    test('keyStat does not affect damage but affects dc', () => {
        const lowCon = useAbility(baseData({ ability: testAbility(), cs: { con: 10, dex: 10, str: 10, levels: characterLevels(1) } }))
        const highCon = useAbility(baseData({ ability: testAbility(), cs: { con: 20, dex: 10, str: 10, levels: characterLevels(1) } }))

        const logs = highCon.damage?.damageLog.groups!
        const EXPECTED_GROUPS = ['feat mod', 'equipment mod', 'status mod']
        for (let exp of EXPECTED_GROUPS) {
            assert.exists(logs.find(a => a.displayName === exp))
        }
        assert.notExists(logs.find(a => a.displayName === 'base mod'))

        assert.notEqual(lowCon.save?.dc, highCon.save?.dc)
    })
})

describe('damageOnPass is precalced', () => {
    test("'half' halves (rounded down) via a readable 'passed save' entry, original preserved", () => {
        const flamingOrb = createEquipment({
            displayName: 'flaming orb',
            mods: { damage: { whitelist: ['magic'], mod: 2 } },
        })

        const result = useAbility(baseData({
            ability: testAbility({ save: { type: 'reflex', baseDc: 12, damageOnPass: 'half' } }),
            es: { amulet: flamingOrb },
        }))

        // full: base 7 + orb (+2) = 9; passed save: floor(9 / 2) = 4
        assert.equal(result.damage?.damageRoll, 9)
        assert.equal(result.damage?.passedSaveDamageRoll, 4)

        // the reduction is a named entry...
        const reduction = util_findModLogGroupItem(result.damage!.passedSaveDamageLog!, {
            groupName: 'passed save', modDisplayName: 'half damage (passed save)',
        })
        assert.exists(reduction)
        assert.equal(reduction!.amount, -5)

        // ...and the original components are still intact in the same log,
        // so evasion-style features can recover the full damage
        assert.deepEqual(result.damage!.passedSaveDamageLog!.roll, result.damage!.damageLog.roll)
        const orbEntry = util_findModLogGroupItem(result.damage!.passedSaveDamageLog!, {
            groupName: 'equipment mod', modDisplayName: 'flaming orb',
        })
        assert.exists(orbEntry)
    })

    test("'none' does 0 damage", () => {
        const result = useAbility(baseData({
            ability: testAbility({ save: { type: 'reflex', baseDc: 12, damageOnPass: 'none' } }),
        }))

        assert.equal(result.damage?.damageRoll, 7)
        assert.equal(result.damage?.passedSaveDamageRoll, 0)
    })

    test("'full' keeps the passed-save damage equal to the full damage", () => {
        const result = useAbility(baseData({ ability: testAbility({ save: { type: 'reflex', baseDc: 12, damageOnPass: 'full' } }) }))

        assert.equal(result.damage?.passedSaveDamageRoll, result.damage?.damageRoll)
    })

    test('A passedSaveDamageLog is derived from the same log as damageLog (ex: the damage reduction is applied to the initial damage, not a fresh and separate calc)', () => {
        // a damage fn with a side effect proves it is invoked exactly once
        let rolls = 0
        const result = useAbility(baseData({
            ability: testAbility({ damage: () => { rolls++; return 7 } }),
        }))

        assert.equal(rolls, 1)
        assert.deepEqual(result.damage!.passedSaveDamageLog!.roll, result.damage!.damageLog.roll)
    })
})

describe('Partial payloads', () => {
    test('a guaranteed damage-only ability (magic-missile-style). save and passedSaveDamageXX are undefined', () => {
        const missile = testAbility({ displayName: 'missile', save: undefined })
        const result = useAbility(baseData({ ability: missile }))

        assert.isUndefined(result.save)
        assert.equal(result.damage?.damageRoll, 7)
        assert.isUndefined(result.damage?.passedSaveDamageRoll)
        assert.isUndefined(result.damage?.passedSaveDamageLog)
    })

    test('Damage block is optional (save only spell)', () => {
        const hold = testAbility({ displayName: 'hold', damage: undefined })
        const result = useAbility(baseData({ ability: hold }))

        assert.isUndefined(result.damage)
        assert.equal(result.save?.dc, 14) // baseDc 12 + con (+2)
    })
})
