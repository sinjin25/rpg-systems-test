export const DEFAULT_STAT = 10
export const DEFAULT_AC = 10

const halveMod = (val: number): number =>
    val >= 0 ? Math.floor(val / 2) : Math.ceil(val / 2)

// General modifier: bonuses are added to the stat before halving (treated as stat bonuses)
export const calculateModifier = (stat: number, bonuses: number[] = []): number => {
    const bonusTotal = (bonuses || []).reduce((acc, curr) => acc + curr, 0)
    return halveMod(stat - DEFAULT_STAT + bonusTotal)
}

// Attack-specific: clamps stat <= 0 to -5 (stats don't go below 0 in play)
export const calculateBaseMod = (stat: number): number => {
    if (stat <= 0) return -5
    return halveMod(stat - DEFAULT_STAT)
}
