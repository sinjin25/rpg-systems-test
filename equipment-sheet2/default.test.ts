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
import csAsMod from '../log2/composition/cs-as-mod.ts'
import { OwnerMaximal } from '../actor2'
import type { BaseEquipment } from './types'
import damage from '../log2/terminal/damage.ts'
import { iterate } from '../simulate/util/iterate.ts'

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

    const dexMod = csAsMod('dex')(owner).total()
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

describe('Weapons roll fresh each tree, nodes are steady per tree', () => {
    test('shortsword', () => {
        const owner = createDefaultOwner({
            es: {
                mainhand: shortsword
            },
        })
        const final = new Set<number>()
        iterate(30, () => {
            const d = damage(owner)
            final.add(d.total())

            assert.equal(d.total(), d.total())
        })
    })
})