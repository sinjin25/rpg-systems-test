import { createDefaultOwner } from '../../actor2'
import { findNodeMatching } from '../index.ts'
import save from './save.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Too lazy to do this rn', () => {
    test('Works with classes', () => {
        const owner = createDefaultOwner({
            cs: {
                dex: 16, // +3
                str: 10,
            },
        })
        const node = save('reflex')(owner)
        expect(node.total()).toBe(3)
        assert.exists(findNodeMatching(node, /reflex/, {
            includeRoot: true,
        }))

        expect(node.children.length).toBe(1)
        // filters children with a score of 0
    })
    /* too test:
    fortitude
    reflex

    base
    modded-cs
    feat-mod
    status-mod
    equipment-mod
    */
})