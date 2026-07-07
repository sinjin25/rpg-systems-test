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

const roll = (
    diceSides: number,
) => {
    return Math.floor(rng() * diceSides) + 1
}

export default roll
