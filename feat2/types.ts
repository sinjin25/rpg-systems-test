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

export type FeatIds =
    | 'Armor Training'
    | 'Battle Focus'
    | 'Divine Protection'
    | 'Fatiguing Blows'
    | 'Improved Initiative'
    | 'Improved Rage'
    | 'Rage'
    | 'Hardy'
    | 'Power Attack'
    | 'Dodge'
    | 'Exotic Proficiency'
    | 'Martial Proficiency'
    | 'Shield Proficiency'
    | 'Tower Shield Proficiency'

export type Feat2Wrapper = {
    id: FeatIds,
    pointer: Feat2,
    meetsPrereq: boolean,
    owned: boolean,
}