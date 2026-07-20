import { characterLevels } from '../../character-sheet/class-level'
import { describe, test, assert, expect } from 'vitest'
import calculateHp from './index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTenHealth, RingPlusTwoCon } from '../../defaults/equipment/index.ts'
import { ModLogMember, util_findModLogGroupItem } from '../log/index.ts'
import { createDefaultOwner } from '../../defaults/index.ts'

describe('calculateHp', () => {
    const findDisplayName = (key: string) => (d: ModLogMember) => d.displayName === key

    test('base health scales with level', () => {
        // con 15 → +2 mod → 12 hp per level
        const calc = calculateHp(createDefaultOwner({
            cs: {
                con: 10,
                levels: characterLevels(1),
            }
        }))
        assert.equal(calc.total, 10)

        const calc2 = calculateHp(createDefaultOwner({
            cs: {
                con: 10,
                levels: characterLevels(3),
            }
        }))
        assert.equal(calc2.total, 30)
    })

    test('base health scales with con with level', () => {
        const calc = calculateHp(createDefaultOwner({
            cs: {
                con: 16,
                levels: characterLevels(1),
            }
        }))
        assert.equal(calc.total, 13)

        const calc2 = calculateHp(createDefaultOwner({
            cs: {
                con: 16,
                levels: characterLevels(3),
            }
        }))
        assert.equal(calc2.total, 39)
    })

    test('equipment can give flat amounts of health', () => {
        const es = { ring: RingPlusTenHealth }
        const calc = calculateHp(createDefaultOwner({
            cs: {
                con: 10,
                levels: characterLevels(1),
            },
            es,
        }))
        assert.equal(
            calc.total,
            20,
        )
    })

    test('con factors in equipment', () => {
        const es = { ring: RingPlusTwoCon }
        const calc = calculateHp(createDefaultOwner({
            cs: {
                con: 10,
                levels: characterLevels(1),
            }, es
        }))
        assert.equal(calc.total, 11)
    })

    test('log records the health sources per group', () => {
        const { log, total } = calculateHp(createDefaultOwner({
            cs: {
                con: 10,
                levels: characterLevels(1),
            },
            es: {
                ring: RingPlusTenHealth,
            }
        }))

        assert.deepEqual(log.groups.map(g => g.displayName), ['base health', 'feats', 'equipment', 'statuses'])

        // the individual item shows up by name inside the equipment group
        const equipMod = util_findModLogGroupItem(log, {
            groupName: 'equipment',
            modDisplayName: RingPlusTenHealth.displayName,
        })
        assert.exists(equipMod)
        assert.equal(equipMod.amount, 10)

        assert.equal(log.finalResult().total, total)
    })

    test('log details the con bonuses feeding base health', () => {
        const { log } = calculateHp(createDefaultOwner({
            cs: {
                con: 10,
                levels: characterLevels(1),
            },
            es: {
                ring: RingPlusTwoCon,
            }
        }))

        // the ring's +2 con is halved inside the con modifier, so it appears
        // as detail on the base health entry rather than as an additive entry
        const baseGroup = log.groups.find(g => g.displayName === 'base health')!
        assert.equal(baseGroup.total, 11)
        assert.deepEqual(baseGroup.entries[0].detail, [
            { displayName: RingPlusTwoCon.displayName, amount: 2 },
        ])
    })
})
