export type RollInstance = {
    roll: (diceSides: number) => number
    /* setSeed: (seed: number) => void
    clearSeed: () => void */
    // ex: handoff new roll instances to simulations
    // ex: seed spawning instance -> create a seed for a map gen, then a fight, then a fight, then an item drop
    spawn: () => RollInstance
    _totalRolls: () => number
    getSeed: () => number
}
