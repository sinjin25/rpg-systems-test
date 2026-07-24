import { findNodeMatching, leaf } from "../..";
import { createDefaultOwner } from "../../defaults";
import modNodeToText from "../../format";
import critFocus from "../feats/crit-focus";
import { FeatMaximal } from "../types";
import damageFeatMod from './damage-feat-mod.ts'
import { describe, test, assert, expect } from 'vitest'


const displayName = 'test-damage-feat'
const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'damage-feat-mod': () => leaf(displayName, 4),
    },
}

describe('Damage Feat Mod', () => {
    test('Can add values', () => {
        const owner = createDefaultOwner({
            fs: { 'test-damage-feat': feat }
        })

        const result = damageFeatMod(owner)
        const find = findNodeMatching(result, /test-damage-feat/i)
        assert.exists(find)
        /* console.log(modNodeToText(result)) */
    })
    test('Does not find unrelated feats', () => {
        const owner = createDefaultOwner({
            fs: { critFocus }
        })

        const result = damageFeatMod(owner)
        const find = findNodeMatching(result, /test-damage-feat/i)
        assert.notExists(find)
        const find2 = findNodeMatching(result, /crit-focus/i)
        assert.notExists(find2)
        /* console.log(modNodeToText(result)) */
    })
})