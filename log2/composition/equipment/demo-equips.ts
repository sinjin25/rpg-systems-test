// remove this later

import newModNode from "../..";
import { BaseEquipment } from "../../../equipment-sheet2/types";

export const dexAmulet: BaseEquipment = {
    displayName: 'dex amulet',
    acceptableSlots: ['amulet'],
    broadContexts: {
        'dex-from-equipment': (owner) => newModNode('dex amulet', [], (owner) => 2)
    }
}

export const strAmulet: BaseEquipment = {
    displayName: 'str amulet',
    acceptableSlots: ['amulet'],
    broadContexts: {
        'str-from-equipment': (owner) => newModNode('str amulet', [], (owner) => 2)
    }
}