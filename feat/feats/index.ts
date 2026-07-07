import { Feat, FeatAppliesContext, FeatContext, standardFilters } from "../core-types"

export { standardFilters } from "../core-types"
export type { BroadContexts, ContextNames } from "../../contexts"
export type { FeatAppliesContext, FeatAppliesFunction, FeatModRequiredData, FeatModFunction, FeatContext, Feat } from "../core-types"

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

export const possibleFeats = {
    featMeleeWeaponFighting,
    featFinesseWeaponFighting,
    featConSaves,
    featAlert,
}

export type PossibleFeats = typeof possibleFeats
