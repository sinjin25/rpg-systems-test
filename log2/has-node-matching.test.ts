import { describe, test, expect } from 'vitest'
import { newModNode, leaf, findNodeMatching } from './index'

// a small tree: root 'effective-attack-stat' -> 'Modded Dex' -> ['Raw Dex', 'Dex From Status']
const tree = () => newModNode('effective-attack-stat', [
    newModNode('Modded Dex', [leaf('Raw Dex', 3), leaf('Dex From Status', 0)]),
])

describe('findNodeMatching', () => {
    test('returns the matching node (with an inspectable total), anywhere in the subtree', () => {
        const hit = findNodeMatching(tree(), /raw dex/i)
        expect(hit?.displayName).toBe('Raw Dex')
        expect(hit?.total()).toBe(3)
    })

    test('undefined when nothing matches - falsy, so a plain existence check still reads', () => {
        expect(findNodeMatching(tree(), /dex/i)).toBeTruthy()   // this branch used dex
        expect(findNodeMatching(tree(), /str/i)).toBeUndefined() // ...not str
    })

    test('root-before-children order: the shallowest match wins', () => {
        // both the root and a descendant contain 'e'; the root is returned first
        expect(findNodeMatching(tree(), /e/i)?.displayName).toBe('effective-attack-stat')
    })

    test('case-insensitive by default for string patterns', () => {
        expect(findNodeMatching(tree(), 'raw dex')?.displayName).toBe('Raw Dex')
        expect(findNodeMatching(tree(), 'raw dex', { caseInsensitive: false })).toBeUndefined()
    })

    test('depth bounds how far it descends', () => {
        // 'dex' only appears on children, not the root name -> depth 0 sees only the root
        expect(findNodeMatching(tree(), /dex/i, { depth: 0 })).toBeUndefined()
        expect(findNodeMatching(tree(), /dex/i, { depth: 1 })?.displayName).toBe('Modded Dex')
        // 'Raw Dex' lives two levels down
        expect(findNodeMatching(tree(), /raw dex/i, { depth: 1 })).toBeUndefined()
        expect(findNodeMatching(tree(), /raw dex/i, { depth: 2 })?.displayName).toBe('Raw Dex')
    })

    test('includeRoot toggles whether the root name itself counts', () => {
        expect(findNodeMatching(tree(), /effective/i)?.displayName).toBe('effective-attack-stat')
        expect(findNodeMatching(tree(), /effective/i, { includeRoot: false })).toBeUndefined()
    })
})
