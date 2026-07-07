import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'

export const RingPlusTenHealth = createEquipment({
    displayName: 'ring plus ten health',
    contexts: [],
    mods: {
        health: { whitelist: ['all'], mod: 10 },
    },
})
