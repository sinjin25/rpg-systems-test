import { possibleFeats } from './feats'
import { FeatSheet, PossibleFeatKeys, RequiredFeatData } from './types'

export const addFeat = (
    data: RequiredFeatData,
    data2: {
        key: PossibleFeatKeys,
    }
) => {
    data.fs[data2.key] = possibleFeats[data2.key]
}

export const defaultFeatSheet: FeatSheet = {}

export { FeatSheet }
