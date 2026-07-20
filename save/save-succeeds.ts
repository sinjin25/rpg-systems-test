// natural 20 always succeeds, natural 1 always fails, regardless of modifiers.
// mirrors attackHits (character/act/attack-hits.ts) - ac is to an attack what a dc
// is to a save. lives here rather than in character/act because saves are resolved
// in the status decay pass, not in act().
export const saveSucceeds = (saveRoll: number, dc: number, naturalRoll?: number): boolean => {
    if (naturalRoll === 20) return true
    if (naturalRoll === 1) return false
    return saveRoll >= dc
}

export default saveSucceeds
