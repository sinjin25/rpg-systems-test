import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'

// +1 threat range and +0.5 multiplier to whatever weapon is equipped alongside it
// - critRange uses -1, since a negative mod shrinks the threshold number (widening it)
export const critAmulet = createEquipment({
    displayName: 'crit amulet',
    contexts: ['melee'],
    mods: {
        critRange: { whitelist: ['all'], mod: -1 },
        critMultiplier: { whitelist: ['all'], mod: 0.5 },
    },
})
