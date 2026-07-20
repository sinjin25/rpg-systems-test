import { Feat, FeatAppliesContext, FeatContext, standardFilters } from "../core-types"
import { featDivineProtection } from "./divine-protection"
import { featRage } from "./rage"
import { featBattleFocus } from "./battle-focus"
import { featFatiguingBlows } from "./fatiguing-blows"
import { featMeasuredStrike } from "./measured-strike"
import { featFeint } from "./feint"

export { standardFilters } from "../core-types"
export type { BroadContexts, ContextNames } from "../../contexts"
export type { FeatAppliesContext, FeatAppliesFunction, FeatModRequiredData, FeatModFunction, FeatContext, Feat } from "../core-types"

export { featDivineProtection } from "./divine-protection"
export { featRage } from "./rage"
export { featBattleFocus } from "./battle-focus"
export { featFatiguingBlows } from "./fatiguing-blows"
export { featMeasuredStrike } from "./measured-strike"
export { featFeint } from "./feint"

// examples
export const featMeleeWeaponFighting: Feat = {
    displayName: 'DEMO Melee Weapon Fighting',
    context: {
        attack: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: ['ranged', 'magic'],
                whitelist: ['melee'],
            }),
            mod: (data = {}) => {
                return 1
            },
        },
        damage: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: ['ranged', 'magic'],
                whitelist: ['melee'],
            }),
            mod: (data = {}) => {
                return 1
            },
        },
        // is increased by crit damage multipliers
        critMultiplier: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: ['ranged', 'magic'],
                whitelist: ['melee'],
            }),
            mod: (data = {}) => {
                return 0
            },
        },
    }
}

// widens a weapon's threat range by 1 (e.g. 20 -> 19-20), regardless of weapon type
// - a negative mod shrinks the threshold number, which is how the range widens
export const featImprovedCritical: Feat = {
    displayName: 'DEMO Improved Critical',
    context: {
        critRange: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['all'],
            }),
            mod: (data) => {
                return -1
            },
        },
    }
}

// a flat melee damage bonus that does NOT scale on a crit (mirrors Power Attack under
// Pathfinder RAW): no 'critMultiplier' entry is defined, so it lands in the flat bucket
// (see crit/split-scaled-damage.ts) instead of being multiplied
export const featPowerAttack: Feat = {
    displayName: 'DEMO Power Attack',
    context: {
        damage: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: ['ranged', 'magic'],
                whitelist: ['melee'],
            }),
            mod: (data) => {
                return 4
            },
        },
    }
}

export const featFinesseWeaponFighting: Feat = {
    displayName: 'DEMO Finesse Weapon Fighting',
    context: {
        attack: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['finesse'],
            }),
            mod: (data) => {
                return 1
            },
        },
    }
}

export const featConSaves: Feat = {
    displayName: 'DEMO Con Saves',
    context: {
        save: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['constitution']
            }),
            mod: (data) => {
                return 1
            },
        }
    }
}

export const featDemoEvenOdd: Feat = {
    displayName: 'DEMO even-odd',
    context: {
        attack: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['all']
            }),
            mod: (data) => {
                if (!data?.cs) return 0

                let mod = 0
                const { dex, str, con } = data.cs

                if (dex % 2 === 0) mod++
                if (str % 2 === 0) mod++
                if (con % 2 === 0) mod++

                return mod
            },
        }
    }
}

export const featAlert: Feat = {
    displayName: 'DEMO Alert',
    context: {
        initiative: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['all'],
            }),
            mod: (data) => {
                return 4
            },
        }
    }
}

export const featDodgy: Feat = {
    displayName: 'DEMO Dodgy',
    context: {
        ac: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['all'],
            }),
            mod: (data) => {
                return 4
            },
        }
    }
}

// grants +1 AC while a shield is equipped. gated on the 'shield' context, which
// calculateAc makes active from worn defensive gear's context tags.
export const featShieldMastery: Feat = {
    displayName: 'Shield Mastery',
    context: {
        ac: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['shield'],
            }),
            mod: (data) => {
                return 1
            },
        }
    }
}

// grants +1 AC only while heavy armor is worn. gated on the 'heavyArmor' context,
// so light/medium armor (or none) does not trigger it.
export const featHeavyArmorMastery: Feat = {
    displayName: 'Heavy Armor Mastery',
    context: {
        ac: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['heavyArmor'],
            }),
            mod: (data) => {
                return 1
            },
        }
    }
}

// Fighter's Armor Training: raises the maximum dexterity bonus worn armor allows
// toward AC. Contributes additively to the 'maxDex' broadcontext, which calculateAc
// folds into the armor's base allowance before clamping dex. Fixed at +1 for now -
// there is no ranked-feature system yet, so this does not scale on fighter level.
export const featArmorTraining: Feat = {
    displayName: 'Armor Training',
    context: {
        maxDex: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['all'],
            }),
            mod: (data) => {
                return 1
            },
        }
    }
}

// prerequisite chain demo: A requires B, B requires both C and D, C and D require nothing
export const featPrereqDemoC: Feat = {
    displayName: 'DEMO Prereq C',
    context: {},
}

export const featPrereqDemoD: Feat = {
    displayName: 'DEMO Prereq D',
    context: {},
}

export const featPrereqDemoB: Feat = {
    displayName: 'DEMO Prereq B',
    context: {},
    prerequisites: (data) => !!data.fs.featPrereqDemoC && !!data.fs.featPrereqDemoD,
}

export const featPrereqDemoA: Feat = {
    displayName: 'DEMO Prereq A',
    context: {},
    prerequisites: (data) => !!data.fs.featPrereqDemoB,
}

export const featPrereqDemoRequiresCOrDorStr: Feat = {
    displayName: 'Demo Prereq C Or D Or Str',
    context: {},
    prerequisites: (data) => {
        return !!data.fs.featPrereqDemoC || !!data.fs.featPrereqDemoD || data.cs.str >= 15
    }
}

export const possibleFeats = {
    featMeleeWeaponFighting,
    featImprovedCritical,
    featPowerAttack,
    featFinesseWeaponFighting,
    featConSaves,
    featAlert,
    featDodgy,
    featShieldMastery,
    featHeavyArmorMastery,
    featArmorTraining,
    featDivineProtection,
    featRage,
    featBattleFocus,
    featFatiguingBlows,
    featMeasuredStrike,
    featFeint,
    featPrereqDemoA,
    featPrereqDemoB,
    featPrereqDemoC,
    featPrereqDemoD,
    featPrereqDemoRequiresCOrDorStr,
}

export type PossibleFeats = typeof possibleFeats
