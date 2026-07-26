import { FeatPrereqFunction } from "../feat/core-types";
import { FeatMaximal, OwnerMaximal } from "../log2/types";
import { InterceptRollFunction } from "../roll-intercept";
import { TriggerHooks } from "../trigger/core-types";

type FeatFightStartFunction = (owner: OwnerMaximal) => StatusEffect | StatusEffect[] | undefined

// broadContexts hooks up to log2 tree calcs
export type Feat2 = FeatMaximal & {
    // replacing from Feat
    // context: FeatContext replaced by broadContexts
    // 
    // from Feat
    description?: string,
    prerequisites?: FeatPrereqFunction,
    onFightStart?: FeatFightStartFunction,
    interceptRoll?: InterceptRollFunction,
    trigger?: TriggerHooks,
    // from Feat, dead
    tags?: string[],
}

import { CharacterSheet } from '../character-sheet'
import { StatusEffect } from "../status-sheet";

export type FeatSheet = Record<string, Feat2>

export type RequiredFeatData = {
    cs: CharacterSheet,
    fs: FeatSheet,
}
