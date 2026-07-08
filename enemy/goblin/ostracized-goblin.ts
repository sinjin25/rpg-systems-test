import { defaultCharacterSheet, defaultEnemySheet } from "../../character-sheet";
import { Owner } from "../../character/actor";
import { defaultEquipmentSheet } from "../../equipment-sheet";
import { defaultFeatSheet } from "../../feat";
import { clawSmall, naturalAc } from "../common/equipment";
import { ambush } from "./feats";

const ostracizedGoblin: Owner = {
    cs: {
        ...defaultEnemySheet,
        dex: 8,
        str: 6,
        con: 8,
        level: 1,
    },
    fs: {
        ...defaultFeatSheet,
        ambush,
    },
    es: {
        ...defaultEquipmentSheet,
        mainhand: clawSmall,
        armor: naturalAc(8)
    }
}

export default ostracizedGoblin