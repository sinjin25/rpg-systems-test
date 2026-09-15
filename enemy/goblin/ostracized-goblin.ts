import { createDefaultAbilitySheet } from "../../ability-sheet2";
import { OwnerMaximal } from "../../actor2";
import { defaultCharacterSheet, defaultEnemySheet } from "../../character-sheet";
import { experienceBreakpoints } from "../../experience";
import { leaf } from "../../log2";
import { clawSmall, naturalAc } from "../common/equipment";
import { ambush } from "./feats";

const ostracizedGoblin: OwnerMaximal = {
    cs: {
        ...defaultEnemySheet,
        dex: 8,
        str: 10,
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
        armor: naturalAc(3)
    },
    ss: {
    },
    as: createDefaultAbilitySheet(),
    tags: [],
    experience: {
        baseOnKill: leaf('base-xp-on-kill', 2),
        breakpoints: [...experienceBreakpoints],
        currentXp: 0,
    }
}

export default ostracizedGoblin