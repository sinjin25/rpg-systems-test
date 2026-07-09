import { possibleFeats } from '../feats'
import { PossibleFeatKeys, RequiredFeatData } from '../types'

// always grants the feat regardless of prerequisites (e.g. a class that
// grants feats for free); the return value reports whether prerequisites
// were actually met, for callers (a UI) that want to gate on it themselves
export const addFeat = (
    data: RequiredFeatData,
    data2: {
        key: PossibleFeatKeys,
    }
): boolean => {
    const feat = possibleFeats[data2.key]
    const meetsPrerequisites = feat.prerequisites?.(data) ?? true
    data.fs[data2.key] = feat
    return meetsPrerequisites
}
