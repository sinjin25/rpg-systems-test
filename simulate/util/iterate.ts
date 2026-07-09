// iterate through x simulations setting seed to x for reproducability
import { setSeed, clearSeed } from '../../roll/index.ts'

export const iterate = <T>(
    iterations: number,
    fn: (seed: number) => T,
): T[] => {
    const results: T[] = []
    for (let seed = 0; seed < iterations; seed++) {
        setSeed(seed)
        results.push(fn(seed))
    }
    clearSeed()
    return results
}
