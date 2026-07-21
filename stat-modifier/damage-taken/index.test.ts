import { describe, test, expect, assert } from 'vitest'
import { createDefaultOwner } from '../../defaults'
import { ContextNames } from '../../contexts'
import { standardFilters } from '../../feat/core-types'
import { StatusEffect } from '../../status-sheet/core-types'
import { ModLog, ModLogMember, util_findModLogGroupItem } from '../log'
import calculateDamageTaken from '.'

// a bare status whose only job is to carry a damageTaken block
const damageTakenStatus = (amount: number, whitelist: ContextNames[] = ['all']): StatusEffect => ({
    displayName: 'Test Status',
    description: 'carries a damageTaken block',
    expiration: { kind: 'rounds-elapsed', remaining: 10 },
    context: {
        damageTaken: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({ whitelist, blacklist: [] }),
            mod: () => amount,
        },
    },
})

describe('calculateDamageTaken', () => {
    test('Is capable of doing nothing', () => {
        const owner = createDefaultOwner({})

        const INPUT = 7
        const OUTPUT = INPUT

        expect(calculateDamageTaken(owner, INPUT).total).toEqual(OUTPUT)
    })

    test('Logs items', () => {
        const owner = createDefaultOwner({ ss: { 'Test Status': damageTakenStatus(2) } })

        const INPUT = 7
        const OUTPUT = 9

        const result = calculateDamageTaken(owner, INPUT)
        expect(result.total).toEqual(OUTPUT)

        const testStatusLog = util_findModLogGroupItem(result.log, {
            groupName: 'statuses',
            modDisplayName: 'Test Status',
        })
        assert.exists(testStatusLog)
        expect(testStatusLog).toMatchObject({
            amount: 2,
            displayName: 'Test Status',
        } as Partial<ModLogMember>)
    })

    test('Correctly clamps negative inputs', () => {
        const owner = createDefaultOwner({ ss: { 'Test Status': damageTakenStatus(-20) } })

        expect(calculateDamageTaken(owner, 7).total).toEqual(0)
    })

    test('a narrowly whitelisted status does not fire on the default empty tags', () => {
        const owner = createDefaultOwner({ ss: { 'Test Status': damageTakenStatus(2, ['longsword']) } })

        expect(calculateDamageTaken(owner, 7).total).toEqual(7)
    })

    test('tags come from the attacker, so a narrow whitelist fires on the attacker weapon', () => {
        const owner = createDefaultOwner({ ss: { 'Test Status': damageTakenStatus(2, ['longsword']) } })

        expect(calculateDamageTaken(owner, 7, ['longsword']).total).toEqual(9)
    })
})
