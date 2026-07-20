import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'

export const bandedMail = createEquipment({
    displayName: 'Banded Mail',
    contexts: ['heavyArmor'],
    ac: 7,
    maxDexBonus: 1,
})

export const halfPlate = createEquipment({
    displayName: 'Half Plate',
    contexts: ['heavyArmor'],
    ac: 8,
    maxDexBonus: 0,
})

export const fullPlate = createEquipment({
    displayName: 'Full Plate',
    contexts: ['heavyArmor'],
    ac: 9,
    maxDexBonus: 0,
})