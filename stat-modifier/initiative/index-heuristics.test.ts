import { CharacterSheet, defaultCharacterSheet } from '../../character-sheet/index.ts'
import { defaultEquipmentSheet } from '../../equipment-sheet/index.ts'
import { featAlert } from '../../feat/feats/index.ts'
import { defaultFeatSheet } from '../../feat/index.ts'
import { default as rollInitiative, calculateInitiativeMod } from './index.ts'
import { setSeed, clearSeed } from '../../roll/index.ts'
import { describe, test, assert, expect, afterEach } from 'vitest'

describe('Dex/Feats are meaningful', () => {
    afterEach(() => clearSeed())

    test('+3 => .64, +7 => .78', () => {
        setSeed(1)
        // const REAL_PROPORTION = .66 // many n
        // const REAL_PROPORTION_FEAT = .805 // many n
        const EXPECTED = .64
        const EXPECTED_FEAT = .79
        const cs: CharacterSheet = {
            ...defaultCharacterSheet,
            dex: 18,
        }

        const cs2: CharacterSheet = {
            ...defaultCharacterSheet,
            dex: 10,
        }

        const iterations = 1000//_00
        let dexActsFirstResult = 0
        let featDexActsFirstResult = 0
        for (let i = 0; i < iterations; i++) {
            const r1 = rollInitiative({
                cs,
                es: defaultEquipmentSheet,
                fs: defaultFeatSheet,
                ss: {},
            })

            const vanilla = rollInitiative({
                cs: cs2,
                es: defaultEquipmentSheet,
                fs: defaultFeatSheet,
                ss: {},
            })

            const r3 = rollInitiative({
                cs,
                es: defaultEquipmentSheet,
                fs: {
                    ...defaultFeatSheet,
                    featAlert,
                },
                ss: {},
            })

            if (r1.total > vanilla.total) dexActsFirstResult++
            if (r3.total > vanilla.total) featDexActsFirstResult++
        }

        expect(dexActsFirstResult / iterations).toBeGreaterThanOrEqual(EXPECTED)
        expect(featDexActsFirstResult / iterations).toBeGreaterThanOrEqual(EXPECTED_FEAT)
    })
})