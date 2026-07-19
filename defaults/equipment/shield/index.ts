import { createEquipment } from "../../../equipment-sheet/create-equipment.ts";

export const shield = createEquipment({
    displayName: 'Buckler',
    contexts: ['shield'],
    ac: 1,
})

export const heavyShield = createEquipment({
    displayName: 'Heavy Shield',
    contexts: ['shield'],
    ac: 2,
})

export const towerShield = createEquipment({
    displayName: 'Tower Shield',
    contexts: ['shield'],
    ac: 3,
    mods: {
        attack: {
            whitelist: ['all'],
            mod() {
                return -2
            }
        }
    }
})