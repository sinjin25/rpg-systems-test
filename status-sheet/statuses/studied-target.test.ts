import { describe, test, expect } from 'vitest'
import { createDefaultOwner } from '../../defaults'
import { bandedMail, heavyShield, longSword } from '../../defaults/equipment'
import calculateAc from '../../stat-modifier/ac'
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

    test('expires on a rounds-elapsed clock', () => {
        expect(studiedTargetStatus().expiration).toEqual({ kind: 'rounds-elapsed', remaining: 10 })
        expect(studiedTargetStatus(3).expiration).toEqual({ kind: 'rounds-elapsed', remaining: 3 })
    })
})
