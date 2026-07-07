import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'

export const RingPlusTwoCon = createEquipment({
    displayName: 'ring plus two con',
    contexts: [],
    mods: {
        stat: { whitelist: ['constitution'], mod: 2 },
    },
})
