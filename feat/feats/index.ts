import { FeatSheet } from "../types"
import { CharacterSheet } from "../../character-sheet"


export type BroadContexts = 'save' | 'attack' | 'skill' | 'damage'
export type ContextNames = 'melee' | 'ranged' | 'magic' | 'finesse' | 'constitution'

export type FeatAppliesContext = {
    whitelist: ContextNames[],
    blacklist: ContextNames[],
}

export type FeatAppliesFunction = (activeContexts: ContextNames[]) => boolean
export type FeatModRequiredData = {
    characterSheet: CharacterSheet,
    featSheet: FeatSheet,
    equipmentSheet: {},
    statusSheet: {},
}
export type FeatModFunction = (data?: Partial<FeatModRequiredData>) => number

// broad contexts
export type FeatContext = {
    /* attack?: {
        applies: FeatAppliesFunction,
        mod: FeatModFunction,
    } */
    [K in BroadContexts]?: {
        applies: FeatAppliesFunction,
        mod: FeatModFunction,
    }
}

export interface Feat {
    displayName: string,
    context: FeatContext,
}

export const standardFilters = {
    noBlacklistAnyWhitelistFactory: (contexts: FeatAppliesContext): FeatAppliesFunction => {
        return (activeContexts: ContextNames[]) => {
            const { blacklist, whitelist } = contexts
            let passed = false
            for (let cont of activeContexts) {
                if (blacklist.includes(cont)) return false
                if (whitelist.includes(cont)) passed = true
            }
            return passed
        }
    }
}

// examples
// attack feat
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
                whitelist: []
            }),
            mod: (data) => {
                if (!data?.characterSheet) return 0

                let mod = 0
                const { dex, str, con } = data.characterSheet

                if (dex % 2 === 0) mod++
                if (str % 2 === 0) mod++
                if (con % 2 === 0) mod++

                return mod
            },
        }
    }
}

// shove everything
export const possibleFeats = {
    featMeleeWeaponFighting,
    featFinesseWeaponFighting,
    featConSaves,
}

export type PossibleFeats = typeof possibleFeats
