export type CritDamageResult = {
    total: number,
    scaledPortion: number,
    flatPortion: number,
    multiplier: number,
}

// combines the weapon's raw damage roll with the scaled/flat damage split (see
// split-scaled-damage/index.ts) to compute the final crit damage: only the roll and the
// 'scaled' mods are multiplied; 'flat' mods (e.g. Power Attack) are added on afterward
export const applyCritMultiplier = (
    rawRollTotal: number,
    scaledModsTotal: number,
    flatModsTotal: number,
    multiplier: number,
): CritDamageResult => {
    const scaledPortion = (rawRollTotal + scaledModsTotal) * multiplier
    const flatPortion = flatModsTotal

    return {
        total: Math.floor(scaledPortion + flatPortion),
        scaledPortion,
        flatPortion,
        multiplier,
    }
}

export default applyCritMultiplier
