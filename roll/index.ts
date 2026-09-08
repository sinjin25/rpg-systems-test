// mulberry32: tiny seeded PRNG, returns a function producing floats in [0, 1)
const mulberry32 = (seed: number) => () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

let rng: () => number = Math.random

// same seed => identical sequence of rolls; use for reproducible sims and tests
export const setSeed = (seed: number) => {
    rng = mulberry32(seed)
}

export const clearSeed = () => {
    rng = Math.random
}

const rollFrom = (rng: () => number) => (diceSides: number) => {
    return Math.floor(rng() * diceSides) + 1
}

const roll = rollFrom(() => rng())

export default roll

export type RollInstance = {
    roll: (diceSides: number) => number
    setSeed: (seed: number) => void
    clearSeed: () => void
    // ex: handoff new roll instances to simulations
    // ex: seed spawning instance -> create a seed for a map gen, then a fight, then a fight, then an item drop
    spawn: () => RollInstance
}

export const createRoll = (seed?: number): RollInstance => {
    let instanceRng: () => number = seed === undefined ? Math.random : mulberry32(seed)

    return {
        roll: (diceSides: number) => rollFrom(instanceRng)(diceSides),
        setSeed: (s: number) => { instanceRng = mulberry32(s) },
        clearSeed: () => { instanceRng = Math.random },
        spawn: () => createRoll(Math.floor(instanceRng() * 0xFFFFFFFF)),
    }
}
