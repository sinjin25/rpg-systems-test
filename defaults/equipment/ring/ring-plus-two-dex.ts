import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'

export const RingPlusTwoDex = createEquipment({
    displayName: 'ring plus two dex',
    contexts: [],
    mods: {
        stat: { whitelist: ['dexterity'], mod: 2 },
    },
})
