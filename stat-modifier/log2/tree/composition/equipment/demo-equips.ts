// remove this later

import newModNode from "../../..";
import { EquipmentMaximal } from "../../types";

export const dexAmulet: EquipmentMaximal = {
    displayName: 'dex amulet',
    broadContexts: {
        'equipment-modded-dex': (owner) => newModNode('dex amulet', [], (owner) => 2)
    }
}

export const strAmulet: EquipmentMaximal = {
    displayName: 'str amulet',
    broadContexts: {
        'equipment-modded-str': (owner) => newModNode('str amulet', [], (owner) => 2)
    }
}