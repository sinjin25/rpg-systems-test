import { createDefaultAbilitySheet } from "../../ability-sheet2";
import { OwnerMaximal } from "../../actor2";
import { defaultCharacterSheet, defaultEnemySheet } from "../../character-sheet";
import { clawSmall, naturalAc } from "../common/equipment";
import { ambush } from "./feats";

const ostracizedGoblin: OwnerMaximal = {
    cs: {
        ...defaultEnemySheet,
        dex: 8,
        str: 6,
        con: 8,
        flavorSheet: {
            description: 'A weak goblin',
            displayName: 'Weak Goblin'
        }
    },
    fs: {
        ambush,
    },
    es: {
        mainhand: clawSmall,
        armor: naturalAc(8)
    },
    ss: {
    },
    as: createDefaultAbilitySheet(),
    tags: [],
}

export default ostracizedGoblin