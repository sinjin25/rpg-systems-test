import { findNodeMatching, leaf } from '..'
import { createDefaultOwner } from '../../actor2'
import addFeat from '../../feat2/add-feat/index.ts'
import { Feat2 } from '../../feat2/index.ts'
import { addStatusToStatusSheet } from '../../status-sheet2/add-status-to-status-sheet.ts'
import { makeWrapper } from '../../status-sheet2/index.ts'
import modNodeToText from '../format'
import speed from './speed.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Speed works', () => {
    test('Begins at 0, named correctly', () => {
        const owner = createDefaultOwner()
        const node = speed(owner)

        assert.equal(node.total(), 0)
        const f0 = findNodeMatching(node, /speed$/, {
            includeRoot: true,
        })
        assert.exists(f0)
    })
    test('Children are handled correctly', () => {
        const speedFeat: Feat2 = {
            displayName: 'spf',
            broadContexts: {
                'speed-feat-mod': () => leaf('spf', 4)
            }
        }
        const speedStatus = makeWrapper({
            displayName: 'sps',
            broadContexts: {
                'speed-status-mod': () => leaf('sps', 2)
            },
        })
        const owner = createDefaultOwner()
        addStatusToStatusSheet(owner, owner, speedStatus)
        addFeat(owner, speedFeat)

        const node = speed(owner)
        const f0 = findNodeMatching(node, /speed$/, {
            includeRoot: true,
        })
        assert.exists(f0)

        const f1 = findNodeMatching(node, /feat-mod/)
        const f2 = findNodeMatching(node, /status-mod/)
        assert.exists(f1)
        assert.exists(f2)

        assert.equal(f1.total(), 4)
        assert.equal(f2.total(), 2)
        assert.equal(node.total(), 6)
    })
})