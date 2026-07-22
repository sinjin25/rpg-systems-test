import { RingPlusTwoCon } from '../../../../../defaults/equipment'
import { createDefaultOwner } from '../../../defaults'
import modNodeToText from '../../../format.ts'
import { dexAmulet, strAmulet } from './demo-equips.ts'
import equipmentModdedStr from './equipment-modded-str.ts'
import { describe, test, assert, expect } from 'vitest'

// demo equipment

describe('equipment-modded-dex', () => {
    test('Can collect relevant equipment', () => {
        const owner = createDefaultOwner({
            es: {
                // @ts-expect-error
                ring: strAmulet,
            }
        })

        const result = equipmentModdedStr(owner)
        console.log('result', result)
        expect(result.total()).toEqual(2)
    })

    test('Picks up the correct context', () => {
        const owner = createDefaultOwner({
            es: {
                // @ts-expect-error
                ring: dexAmulet,
            }
        })

        const result = equipmentModdedStr(owner)
        console.log('result', result)
        expect(result.total()).toEqual(0)
    })
})
