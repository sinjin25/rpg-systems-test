// iterate through x simulations, handing each one its own seeded RollInstance for reproducability
import { createRoll } from '../../roll/index'
import { RollInstance } from '../../roll/types'

export const iterate = <T>(
    iterations: number,
    fn: (seed: number, rollInstance: RollInstance) => T,
): T[] => {
    const results: T[] = []
    for (let seed = 0; seed < iterations; seed++) {
        results.push(fn(seed, createRoll(seed)))
    }
    return results
}
