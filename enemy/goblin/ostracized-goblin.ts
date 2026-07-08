import { defaultCharacterSheet, defaultEnemySheet } from "../../character-sheet";
import { Owner } from "../../character/actor";
import { defaultEquipmentSheet } from "../../equipment-sheet";
import { defaultFeatSheet } from "../../feat";
import { clawSmall } from "../common/equipment";
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
    }
}

export default ostracizedGoblin