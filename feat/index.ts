type ContextNames = 'melee' | 'ranged' | 'magic'

type FeatAppliesContext = {
    whitelist: ContextNames[],
    blacklist: ContextNames[],
}
type FeatAppliesFunction = (activeContexts: ContextNames[]) => boolean

interface FeatContext {
    attack?: {
        applies: FeatAppliesFunction,
        mod: number,
    }
}

interface Feat {
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
export const featMeleeWeaponFighting: Feat = {
    displayName: 'Melee Weapon Fighting',
    context: {
        attack: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: ['ranged', 'magic'],
                whitelist: ['melee'],
            }),
            mod: 1,
        }
    }
}