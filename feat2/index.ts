import { ObjectWithBroadContexts } from "../log2/types";
import { OwnerMaximal } from "../actor2";
import { TriggerHooks } from "../trigger/core-types";

type FeatFightStartFunction = (owner: OwnerMaximal) => StatusEffectWrapper | StatusEffectWrapper[] | undefined

type FeatPrereqFunction = (owner: OwnerMaximal) => boolean

// broadContexts hooks up to log2 tree calcs
export type Feat2 = ObjectWithBroadContexts & {
    // replacing from Feat
    // context: FeatContext replaced by broadContexts
    // 
    // from Feat
    description?: string,
    prerequisites?: FeatPrereqFunction,
    onFightStart?: FeatFightStartFunction,
    /* interceptRoll?: InterceptRollFunction, */
    /* trigger?: TriggerHooks, */
    // from Feat, dead
    tags?: string[],
}

import { CharacterSheet } from '../character-sheet'
import { StatusEffectWrapper } from "../status-sheet2";

export type FeatSheet = Record<string, Feat2>

export type RequiredFeatData = {
    cs: CharacterSheet,
    fs: FeatSheet,
}