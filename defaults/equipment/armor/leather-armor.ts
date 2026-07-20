import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'

export const leatherArmor = createEquipment({
    displayName: 'leather armor',
    contexts: ['lightArmor'],
    ac: 2,
})
