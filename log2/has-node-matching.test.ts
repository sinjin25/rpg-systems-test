import { describe, test, expect, assert } from 'vitest'
import { newModNode, leaf, findNodeMatching } from './index'

const tree = () => newModNode('effective-attack-stat', [
    newModNode('Modded Dex', [leaf('Raw Dex', 3), leaf('Dex From Status', 0)]),
])

describe('findNodeMatching', () => {
    test('returns the matching node (with an inspectable total), anywhere in the subtree', () => {
        const hit = findNodeMatching(tree(), /raw dex/i)
        expect(hit?.displayName).toBe('Raw Dex')
        expect(hit?.total()).toBe(3)
    })

    test('Returns undefined when nothing matches', () => {
        assert.exists(findNodeMatching(tree(), /dex/i))
        assert.notExists(findNodeMatching(tree(), /str/i))
    })

    test('Start at root', () => {
        // both the root and a descendant contain 'e'; the root is returned first
        expect(findNodeMatching(tree(), /e/i)?.displayName).toBe('effective-attack-stat')
    })

    test('case-insensitive by default for string patterns', () => {
        expect(findNodeMatching(tree(), 'raw dex')?.displayName).toBe('Raw Dex')
        expect(findNodeMatching(tree(), 'raw dex', { caseInsensitive: false })).toBeUndefined()
    })

    test('depth bounds how far it descends', () => {
        assert.notExists(findNodeMatching(tree(), /dex/i, { depth: 0 }))
        assert.equal(findNodeMatching(tree(), /dex/i, { depth: 1 })?.displayName, 'Modded Dex')

        assert.notExists(findNodeMatching(tree(), /raw dex/i, { depth: 1 }))
        assert.equal(findNodeMatching(tree(), /raw dex/i, { depth: 2 })?.displayName, 'Raw Dex')
    })

    test('Use includeRoot option to include the root', () => {
        expect(findNodeMatching(tree(), /effective/i)?.displayName).toBe('effective-attack-stat')
        expect(findNodeMatching(tree(), /effective/i, { includeRoot: false })).toBeUndefined()
    })
})
