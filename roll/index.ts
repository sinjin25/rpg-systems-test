import { RollInstance } from "./types";

// mulberry32: tiny seeded PRNG, returns a function producing floats in [0, 1)
const mulberry32 = (seed: number) => () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

let rng: () => number = Math.random

// just used to make sure we know if this has changed for tests
export const getGlobalRng = () => rng
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

// 0xFFFFFFFF is the maximum value of a 32-bit unsigned integer — 4294967295. It's used here to keep the generated seed within the range that mulberry32 operates on, since mulberry32 does bitwise operations (|0, Math.imul) that are defined for 32-bit integers.
export const createRoll = (seed: number = Math.floor(Math.random() * 0xFFFFFFFF)): RollInstance => {
    let instanceRng: () => number = mulberry32(seed)

    // total rolls
    let tr = 0

    return {
        _totalRolls: () => tr,
        getSeed: () => seed,
        roll: (diceSides: number) => {
            const ret = rollFrom(instanceRng)(diceSides)
            tr++
            return ret
        },
        spawn: () => {
            const ret = createRoll(Math.floor(instanceRng() * 0xFFFFFFFF))
            tr++
            return ret
        },
    }
}
