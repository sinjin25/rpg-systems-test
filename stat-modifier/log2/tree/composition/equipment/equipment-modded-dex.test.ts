import { RingPlusTwoCon } from '../../../../../defaults/equipment/index.ts'
import { createDefaultOwner } from '../../../defaults'
import modNodeToText from '../../../format.ts'
import { dexAmulet } from './demo-equips.ts'
import equipmentModdedDex from './equipment-modded-dex.ts'
import { describe, test, assert, expect } from 'vitest'

// demo equipment

describe('equipment-modded-dex', () => {
    test('Can collect relevant equipment', () => {
        const owner = createDefaultOwner({
            es: {
                // @ts-expect-error
                ring: dexAmulet,
            }
        })

        const result = equipmentModdedDex(owner)
        console.log('result', result)
        expect(result.total()).toEqual(2)

        console.log(modNodeToText(result))
    })
})
