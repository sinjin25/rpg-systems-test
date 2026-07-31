import {
    armors,
    dagger,
    shortsword,
    shortswordPlusOne,
    shortswordPlusOneIfFighter
} from './defaults.ts'
import { describe, test, assert, expect } from 'vitest'
import ac from '../log2/terminal/ac.ts'
import { createDefaultOwner } from '../defaults'
import moddedCsScore from '../log2/composition/modded-cs-score.ts'
import { OwnerMaximal } from '../actor2'
import type { BaseEquipment } from './types'

// cs scores
const HIGH_BASE = 18 // from character creation
const HIGH_LEVEL_BASE = 22 // from character creation + level 16
const HIGH_LEVEL_BUFFS_BASE = 30 // just arbitrary buffs/items

const highEndDexActor = createDefaultOwner({
    cs: {
        dex: HIGH_LEVEL_BUFFS_BASE,
    }
})

const BASE_AC = 10

// the terminal `ac` tree still reads the old equipment-sheet shape, so it ignores
// these armors entirely. Solve it straight off the broadContexts instead.
const acWithArmor = (dexScore: number, armor: BaseEquipment) => {
    const owner = createDefaultOwner({ cs: { dex: dexScore } }) as unknown as OwnerMaximal

    const dexMod = moddedCsScore('dex')(owner).total()
    const armorAc = armor.broadContexts['ac-of-equipment']!(owner)!.total()
    const maxDex = armor.broadContexts['max-dex-of-equipment']!(owner)!.total()

    return BASE_AC + Math.min(dexMod, maxDex) + armorAc
}

describe('Armor heuristics', () => {

    test('Extremely high dex outperforms low investment armor', () => {
        console.table({
            padded: Array.from({ length: 10 }, ((_, i) => i)),
            plate: Array.from({ length: 10 }, ((_, i) => i)),
        })
    })
    test('Heavy armor can outperform with armor training', () => {

    })
})