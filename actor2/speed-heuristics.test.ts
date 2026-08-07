import { describe, test, assert, expect, afterEach } from 'vitest'
import { instantiateSpeed } from './instantiate'
import { createDefaultOwner } from '.'
import improvedInitiative from '../feat2/feats/improved-initiative'
import { clearSeed, setSeed } from '../roll'

describe('initiative: Dex/Feats are meaningful', () => {
    afterEach(() => clearSeed())
    test('+3 => .64, +7 => .78', () => {
        setSeed(1)
        // const REAL_PROPORTION = .66 // many n
        // const REAL_PROPORTION_FEAT = .805 // many n
        const EXPECTED = .63
        const EXPECTED_FEAT = .79
        const ownerVeryFast = createDefaultOwner({
            cs: {
                dex: 18,
            },
            fs: {
                improvedInitiative,
            }
        })
        const ownerFast = createDefaultOwner({
            cs: {
                dex: 18
            }
        })
        const ownerSlow = createDefaultOwner({
            cs: {
                dex: 10,
            }
        })

        const iterations = 1000//_00
        let dexActsFirstResult = 0
        let featDexActsFirstResult = 0
        for (let i = 0; i < iterations; i++) {
            const ovf = instantiateSpeed(ownerVeryFast).tree
            const of = instantiateSpeed(ownerFast).tree
            const os = instantiateSpeed(ownerSlow).tree

            /* console.log(ovf, of, os) */
            if (of.total() > os.total()) dexActsFirstResult++
            if (ovf.total() > os.total()) featDexActsFirstResult++
        }

        expect(dexActsFirstResult / iterations).toBeGreaterThanOrEqual(EXPECTED)
        expect(featDexActsFirstResult / iterations).toBeGreaterThanOrEqual(EXPECTED_FEAT)
    })
})