import { describe, test, expect } from 'vitest'
import { createDefaultOwner } from '../../defaults'
import { bandedMail, heavyShield, longSword } from '../../defaults/equipment'
import calculateAc from '../../stat-modifier/ac'
import calculateDamageTaken from '../../stat-modifier/damage-taken'
import { util_findModLogGroupItem } from '../../stat-modifier/log'
import studiedTargetStatus from './studied-target'

const acEntry = (owner: ReturnType<typeof createDefaultOwner>) =>
    util_findModLogGroupItem(calculateAc(owner).log, {
        groupName: 'statuses',
        modDisplayName: 'Studied Target',
    })

describe('studiedTargetStatus', () => {
    test('applies -1 ac', () => {
        const owner = createDefaultOwner({})
        const before = calculateAc(owner).total

        owner.ss['Studied Target'] = studiedTargetStatus()

        expect(calculateAc(owner).total).toEqual(before - 1)
        expect(acEntry(owner)?.amount).toEqual(-1)
    })

    test('applies regardless of what the defender is wearing', () => {
        const armored = createDefaultOwner({
            es: { mainhand: longSword, offhand: heavyShield, armor: bandedMail },
            ss: { 'Studied Target': studiedTargetStatus() },
        })

        expect(acEntry(armored)?.amount).toEqual(-1)
    })

    test('adds +2 to damage taken', () => {
        const owner = createDefaultOwner({})
        expect(calculateDamageTaken(owner, 8).total).toEqual(8)

        owner.ss['Studied Target'] = studiedTargetStatus()

        expect(calculateDamageTaken(owner, 8).total).toEqual(10)
        expect(util_findModLogGroupItem(calculateDamageTaken(owner, 8).log, {
            groupName: 'statuses',
            modDisplayName: 'Studied Target',
        })?.amount).toEqual(2)
    })

    test('the damage bonus fires regardless of the attacker weapon tags', () => {
        const owner = createDefaultOwner({ ss: { 'Studied Target': studiedTargetStatus() } })

        expect(calculateDamageTaken(owner, 8, ['longsword', 'melee']).total).toEqual(10)
        expect(calculateDamageTaken(owner, 8, []).total).toEqual(10)
    })

    test('expires on a rounds-elapsed clock', () => {
        expect(studiedTargetStatus().expiration).toEqual({ kind: 'rounds-elapsed', remaining: 10 })
        expect(studiedTargetStatus(3).expiration).toEqual({ kind: 'rounds-elapsed', remaining: 3 })
    })
})
