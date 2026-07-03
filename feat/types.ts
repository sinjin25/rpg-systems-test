import { CharacterSheet } from '../character-sheet'
import { featMeleeWeaponFighting, standardFilters, ContextNames, Feat, FeatAppliesContext, FeatAppliesFunction, FeatContext, possibleFeats, PossibleFeats } from './feats'

export type FeatSheet = {
    // partial
    [K in keyof PossibleFeats]?: PossibleFeats[K]
}

export type PossibleFeatKeys = keyof PossibleFeats

export type RequiredFeatData = {
    characterSheet: CharacterSheet,
    featSheet: FeatSheet,
}