import { findNodeMatching } from '../../index.ts'
import { createDefaultOwner } from '../../../actor2'
import saveStatusMod from './save-status-mod.ts'
import { describe, test, assert, expect } from 'vitest'

describe('save-status-mod', () => {
    const owner = createDefaultOwner()
    test('Works for fortitude', () => {
        const node = saveStatusMod('fortitude')(owner)
        const found = findNodeMatching(node, /fortitude-status-mod$/, {
            includeRoot: true,
        })
        assert.exists(found)
        assert.equal(found.total(), 0)
    })
    test('Works for reflex', () => {
        const node = saveStatusMod('reflex')(owner)
        const found = findNodeMatching(node, /reflex-status-mod$/, {
            includeRoot: true,
        })
        assert.exists(found)
        assert.equal(found.total(), 0)
    })
    test('Works for will', () => {
        const node = saveStatusMod('will')(owner)
        const found = findNodeMatching(node, /will-status-mod$/, {
            includeRoot: true,
        })
        assert.exists(found)
        assert.equal(found.total(), 0)
    })
})