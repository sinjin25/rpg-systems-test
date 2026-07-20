import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'
import roll from '../../../roll/index.ts'

export const shortsword = createEquipment({
    displayName: 'shortsword',
    contexts: ['shortsword', 'melee'],
    damage: () => roll(6),
})

export const longSword = createEquipment({
    displayName: 'longsword',
    contexts: ['longsword', 'melee'],
    damage: () => roll(8)
})
