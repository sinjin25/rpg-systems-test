import { describe, test, assert } from 'vitest'

import fortitudeSaveModifierFactory from './fortitude.ts'
import { defaultFeatSheet } from '../../feat/index.ts'
import { featConSaves } from '../../feat/feats/index.ts'

describe('fortitude save', () => {
    test('scales off constitution, not dexterity', () => {
        const fort = fortitudeSaveModifierFactory({
            cs: { con: 14, dex: 20, str: 10, level: 1 },
            es: {},
            fs: defaultFeatSheet,
            ss: {},
        })

        // con 14 -> +2; the high dex is ignored
        assert.equal(fort().total, 2)
    })

    test('applies a feat that targets constitution saves', () => {
        const fort = fortitudeSaveModifierFactory({
            cs: { con: 14, dex: 10, str: 10, level: 1 },
            es: {},
            fs: { ...defaultFeatSheet, featConSaves },
            ss: {},
        })

        // con +2, plus featConSaves (+1 on the 'save' context, whitelisting 'constitution')
        assert.equal(fort().total, 3)
    })

    test('can produce a negative modifier', () => {
        const fort = fortitudeSaveModifierFactory({
            cs: { con: 8, dex: 10, str: 10, level: 1 },
            es: {},
            fs: defaultFeatSheet,
            ss: {},
        })

        // con 8 -> -1
        assert.equal(fort().total, -1)
    })
})
