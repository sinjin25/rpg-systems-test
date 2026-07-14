// natural 20 always hits, natural 1 always misses, regardless of modifiers
export const attackHits = (attackRoll: number, ac: number, naturalRoll?: number): boolean => {
    if (naturalRoll === 20) return true
    if (naturalRoll === 1) return false
    return attackRoll >= ac
}

export default attackHits
