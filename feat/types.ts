import { CharacterSheet } from '../character-sheet'
import { possibleFeats, PossibleFeats } from './feats'

export type FeatSheet = {
    [K in keyof PossibleFeats]?: PossibleFeats[K]
}

export type PossibleFeatKeys = keyof PossibleFeats

export type RequiredFeatData = {
    cs: CharacterSheet,
    fs: FeatSheet,
}
