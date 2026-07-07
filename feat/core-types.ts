import { BroadContexts, ContextNames } from "../contexts"
import { CharacterSheet } from "../character-sheet"

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
    ss: {},
}

export type FeatModFunction = (data?: Partial<FeatModRequiredData>) => number

export type FeatContext = {
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
