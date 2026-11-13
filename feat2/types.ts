import type { ObjectWithBroadContexts } from "../log2/types";
import type { OwnerMaximal } from "../actor2/types";
import { TriggerHooks } from "../trigger/core-types";

type FeatFightStartFunction = (owner: OwnerMaximal) => StatusEffectWrapper | StatusEffectWrapper[] | undefined

type FeatPrereqFunction = (owner: OwnerMaximal) => boolean

export type FeatIds =
    | 'armorTraining'
    | 'battleFocus'
    | 'divineProtection'
    | 'fatiguingBlows'
    | 'improvedInitiative'
    | 'improvedRage'
    | 'rage'
    | 'hardy'
    | 'powerAttack'
    | 'dodge'
    | 'exoticProficiency'
    | 'martialProficiency'
    | 'shieldProficiency'
    | 'towerShieldProficiency'
    | 'finesseWeaponFighting'
    | 'meleeWeaponFighting'
    | 'shieldMastery'
    | 'heavyArmorMastery'
    | 'critFocus'
    | 'improvedCritical'
    | 'ambush'

// broadContexts hooks up to log2 tree calcs
export type Feat2 = ObjectWithBroadContexts & {
    id: string,
    hidden: boolean,
    description?: string,
    prerequisites?: FeatPrereqFunction,
    onFightStart?: FeatFightStartFunction,
    /* interceptRoll?: InterceptRollFunction, */
    /* trigger?: TriggerHooks, */
    tags?: string[],
}

import type { CharacterSheet } from '../character-sheet'
import type { StatusEffectWrapper } from "../status-sheet2";

export type FeatSheet = Record<string, Feat2>

export type RequiredFeatData = {
    cs: CharacterSheet,
    fs: FeatSheet,
}

export type Feat2Wrapper = {
    id: FeatIds,
    pointer: Feat2,
    meetsPrereq: boolean,
    owned: boolean,
    hide: boolean, // ex: deactivated
}