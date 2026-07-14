import { BroadContexts, ContextNames } from "../contexts"
import { CharacterSheet } from "../character-sheet"
import { StatusSheet } from "../status-sheet/types"
import type { StatusEffect } from "../status-sheet/core-types"
import type { TriggerHooks } from "../trigger/core-types"
import type { InterceptRollFunction } from "../roll-intercept"
import type { RequiredFeatData } from "./types"

export type FeatAppliesContext = {
    whitelist: ContextNames[],
    blacklist: ContextNames[],
}

export type FeatAppliesFunction = (activeContexts: ContextNames[]) => boolean

// fs typed as {} intentionally — FeatSheet is defined downstream of feat instances
export type FeatModRequiredData = {
    cs: CharacterSheet,
    fs: {},
    es: {},
    ss: StatusSheet,
}

export type FeatModFunction = (data?: Partial<FeatModRequiredData>) => number

export type FeatContext = {
    [K in BroadContexts]?: {
        applies: FeatAppliesFunction,
        mod: FeatModFunction,
    }
}

// invoked once per actor at fight start (see feat/fight-start.ts); returns
// the status(es) this feat grants, if any
export type FeatFightStartFunction = (data?: Partial<FeatModRequiredData>) => StatusEffect | StatusEffect[] | undefined

// evaluates whether a character currently qualifies for this feat; purely
// advisory — addFeat reports the result but always grants the feat regardless,
// so callers (e.g. a class that grants feats for free) can bypass it
export type FeatPrereqFunction = (data: RequiredFeatData) => boolean

export interface Feat {
    displayName: string,
    description?: string,
    context: FeatContext,
    tags?: string[],
    prerequisites?: FeatPrereqFunction,
    onFightStart?: FeatFightStartFunction,
    interceptRoll?: InterceptRollFunction
    trigger?: TriggerHooks,
}

export const standardFilters = {
    noBlacklistAnyWhitelistFactory: (contexts: FeatAppliesContext): FeatAppliesFunction => {
        return (activeContexts: ContextNames[]) => {
            const { blacklist, whitelist } = contexts
            // 'all' in the whitelist means "applies to everything not blacklisted";
            // an empty whitelist never applies
            let passed = whitelist.includes('all')
            for (let cont of activeContexts) {
                if (blacklist.includes(cont)) return false
                if (whitelist.includes(cont)) passed = true
            }
            return passed
        }
    }
}

// unconditional "always applies" filter - for buffs/statuses that aren't
// gated by any particular context tag
export const allContexts: FeatAppliesFunction = standardFilters.noBlacklistAnyWhitelistFactory({
    whitelist: ['all'],
    blacklist: [],
})
