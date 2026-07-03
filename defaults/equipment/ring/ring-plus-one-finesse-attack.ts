import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'

export const RingPlusOneFinesseAttack = createEquipment({
    displayName: 'ring plus one finesse attack',
    contexts: [],
    mods: {
        attack: { whitelist: ['finesse'], mod: 1 },
        damage: { whitelist: ['finesse'], mod: 1 },
    },
})
