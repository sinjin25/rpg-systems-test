// default equipment for testing purposes
import newModNode, { leaf, ModNode, sumFunc } from '../log2'
import { Tags } from '../log2/tags'
import { ModNodeOpts, ObjectWithBroadContexts, OwnerLog2 } from '../log2/types'
import rollTree from '../log2/roll'
import type { BaseEquipment, EquipmentSheet } from './types'
import { classLevelCounts } from '../class-level2/derive'
import { blueprintToBaseEquipment } from './factory/broad-context-adapter'
import { weaponBaseItemLookupTable } from './factory/tables/weapon'
import { armorBaseItemLookupTable } from './factory/tables/armor'
import { offhandBaseItemLookupTable } from './factory/tables/offhand'

export const SLOT_TYPE: Record<string, BaseEquipment['acceptableSlots']> = {
    weapon: ['mainhand', 'offhand'],
    shield: ['offhand'],
    armor: ['armor'],
    amulet: ['amulet'],
    ring: ['ring'],
}

export const armors: Record<keyof typeof armorBaseItemLookupTable, BaseEquipment> = {
    clothing: blueprintToBaseEquipment(
        { slot: 'armor', base: { name: 'clothing', ...armorBaseItemLookupTable['clothing'] }, affix: [], suffix: [] },
        'clothing',
    ),
    'padded armor': blueprintToBaseEquipment(
        { slot: 'armor', base: { name: 'padded armor', ...armorBaseItemLookupTable['padded armor'] }, affix: [], suffix: [] },
        'padded armor',
    ),
    leather: blueprintToBaseEquipment(
        { slot: 'armor', base: { name: 'leather', ...armorBaseItemLookupTable['leather'] }, affix: [], suffix: [] },
        'leather',
    ),
    'chain shirt': blueprintToBaseEquipment(
        { slot: 'armor', base: { name: 'chain shirt', ...armorBaseItemLookupTable['chain shirt'] }, affix: [], suffix: [] },
        'chain shirt',
    ),
    'scale mail': blueprintToBaseEquipment(
        { slot: 'armor', base: { name: 'scale mail', ...armorBaseItemLookupTable['scale mail'] }, affix: [], suffix: [] },
        'scale mail',
    ),
    breastplate: blueprintToBaseEquipment(
        { slot: 'armor', base: { name: 'breastplate', ...armorBaseItemLookupTable['breastplate'] }, affix: [], suffix: [] },
        'breastplate',
    ),
    'splint mail': blueprintToBaseEquipment(
        { slot: 'armor', base: { name: 'splint mail', ...armorBaseItemLookupTable['splint mail'] }, affix: [], suffix: [] },
        'splint mail',
    ),
    'banded mail': blueprintToBaseEquipment(
        { slot: 'armor', base: { name: 'banded mail', ...armorBaseItemLookupTable['banded mail'] }, affix: [], suffix: [] },
        'banded mail',
    ),
    plate: blueprintToBaseEquipment(
        { slot: 'armor', base: { name: 'plate', ...armorBaseItemLookupTable['plate'] }, affix: [], suffix: [] },
        'plate',
    ),
}

const buildOffhand = (name: keyof typeof offhandBaseItemLookupTable): BaseEquipment =>
    blueprintToBaseEquipment(
        { slot: 'offhand', base: { name, ...offhandBaseItemLookupTable[name] }, affix: [], suffix: [] },
        offhandBaseItemLookupTable[name].base.displayName,
    )

export const buckler: BaseEquipment = buildOffhand('buckler')

export const lightShield: BaseEquipment = buildOffhand('lightShield')

export const heavyShield: BaseEquipment = buildOffhand('heavyShield')

export const towerShield: BaseEquipment = buildOffhand('towerShield')

export const shortsword: BaseEquipment = blueprintToBaseEquipment(
    { slot: 'mainhand', base: { name: 'shortsword', ...weaponBaseItemLookupTable['shortsword'] }, affix: [], suffix: [] },
    weaponBaseItemLookupTable['shortsword'].base.displayName,
)

export const longsword: BaseEquipment = blueprintToBaseEquipment(
    { slot: 'mainhand', base: { name: 'longsword', ...weaponBaseItemLookupTable['longsword'] }, affix: [], suffix: [] },
    weaponBaseItemLookupTable['longsword'].base.displayName,
)

export const dagger: BaseEquipment = blueprintToBaseEquipment(
    { slot: 'mainhand', base: { name: 'dagger', ...weaponBaseItemLookupTable['dagger'] }, affix: [], suffix: [] },
    weaponBaseItemLookupTable['dagger'].base.displayName,
)

export const rapier: BaseEquipment = blueprintToBaseEquipment(
    { slot: 'mainhand', base: { name: 'rapier', ...weaponBaseItemLookupTable['rapier'] }, affix: [], suffix: [] },
    weaponBaseItemLookupTable['rapier'].base.displayName,
)

export const bastardSword: BaseEquipment = blueprintToBaseEquipment(
    { slot: 'mainhand', base: { name: 'bastardSword', ...weaponBaseItemLookupTable['bastardSword'] }, affix: [], suffix: [] },
    weaponBaseItemLookupTable['bastardSword'].base.displayName,
)

// a lot of the tests used a shortsword which didn't have martial properties
// this makes testing a pain in the ass since you have to include martial prof in everything
export const testshortsword: BaseEquipment = blueprintToBaseEquipment(
    { slot: 'mainhand', base: { name: 'shortsword', ...weaponBaseItemLookupTable['shortsword'] }, affix: [], suffix: [] },
    weaponBaseItemLookupTable['shortsword'].base.displayName,
)
{
    const ind = testshortsword.tags?.findIndex(a => a === 'finesse')!
    testshortsword.tags?.splice(ind, 1)
    const ind2 = testshortsword.tags?.findIndex(a => a === 'martial')!
    testshortsword.tags?.splice(ind2, 1)
}

export const shortswordPlusOne: BaseEquipment = blueprintToBaseEquipment(
    { slot: 'mainhand', base: { name: 'shortsword', ...weaponBaseItemLookupTable['shortsword'] }, affix: [], suffix: [] },
    weaponBaseItemLookupTable['shortsword'].base.displayName,
)
{
    shortswordPlusOne.displayName = 'shortsword-plus-one'
    shortswordPlusOne.broadContexts.enhancement = (o: OwnerLog2) => {
        return leaf('shortsword-plus-one', 1)
    }
}

export const shortswordPlusOneIfFighter: BaseEquipment = blueprintToBaseEquipment(
    { slot: 'mainhand', base: { name: 'shortsword', ...weaponBaseItemLookupTable['shortsword'] }, affix: [], suffix: [] },
    weaponBaseItemLookupTable['shortsword'].base.displayName,
)
{
    shortswordPlusOneIfFighter.displayName = 'shortsword-plus-one-if-fighter'
    shortswordPlusOneIfFighter.broadContexts.enhancement = (o: OwnerLog2) => {
        const fLevelCnt = classLevelCounts(o.cs.levels).fighter
        if (fLevelCnt === undefined) return leaf('shortswordPlusOneIfFighter', 0)
        return leaf('shortswordPlusOneIfFighter', fLevelCnt)
    }
}