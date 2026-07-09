import { Feat, FeatAppliesContext, FeatContext, standardFilters } from "../core-types"
import { featDivineProtection } from "./divine-protection"
import { featRage } from "./rage"
import { featBattleFocus } from "./battle-focus"

export { standardFilters } from "../core-types"
export type { BroadContexts, ContextNames } from "../../contexts"
export type { FeatAppliesContext, FeatAppliesFunction, FeatModRequiredData, FeatModFunction, FeatContext, Feat } from "../core-types"

export { featDivineProtection } from "./divine-protection"
export { featRage } from "./rage"
export { featBattleFocus } from "./battle-focus"

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
        }
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
    featFinesseWeaponFighting,
    featConSaves,
    featAlert,
    featDodgy,
    featDivineProtection,
    featRage,
    featBattleFocus,
    featPrereqDemoA,
    featPrereqDemoB,
    featPrereqDemoC,
    featPrereqDemoD,
    featPrereqDemoRequiresCOrDorStr,
}

export type PossibleFeats = typeof possibleFeats
