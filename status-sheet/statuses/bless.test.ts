import { standardAttackModifierFactory } from '../../attack/index.ts'
import { shortsword } from '../../defaults/equipment/index.ts'
import { createDefaultOwner } from '../../defaults/index.ts'
import blessStatus from './bless.ts'
import { describe, test, assert, expect } from 'vitest'

describe('bless status affects attack rolls', () => {
    test('Adds +2 to attack', () => {
        const owner = createDefaultOwner({
            ss: {
                blessStatus,
            }
        })
        const attack = standardAttackModifierFactory({
            ...owner,
            weapon: owner.es.mainhand!,
        })

        const result = attack()
        const statusModGroup = result.groups.find(a => a.displayName === 'status mod')
        assert.exists(statusModGroup)

        const blessMod = statusModGroup.entries.find(a => a.displayName === 'Bless')
        assert.exists(blessMod)
        assert.equal(blessMod.amount, 2)
    })
})