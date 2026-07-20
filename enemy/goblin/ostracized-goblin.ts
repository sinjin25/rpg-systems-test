import { defaultCharacterSheet, defaultEnemySheet } from "../../character-sheet";
import { Owner } from "../../character/actor";
import { defaultEquipmentSheet } from "../../equipment-sheet";
import { defaultFeatSheet } from "../../feat";
import { defaultStatusSheet } from "../../status-sheet";
import { createDefaultAbilitySheet } from "../../ability-sheet";
import { clawSmall, naturalAc } from "../common/equipment";
import { ambush } from "./feats";

const ostracizedGoblin: Owner = {
    cs: {
        ...defaultEnemySheet,
        dex: 8,
        str: 6,
        con: 8,
    },
    fs: {
        ...defaultFeatSheet,
        ambush,
    },
    es: {
        ...defaultEquipmentSheet,
        mainhand: clawSmall,
        armor: naturalAc(8)
    },
    ss: {
        ...defaultStatusSheet,
    },
    as: createDefaultAbilitySheet(),
}

export default ostracizedGoblin