import { createDefaultOwner } from '../../actor2/index.ts'
import newModNode, { leaf, sumFunc, productFunc, maxFunc } from '../../log2'
import type { ModNode } from '../../log2'
import modNodeToText from '../../log2/format.ts'
import attack from '../../log2/terminal/attack.ts'
import freezeModNodeRecursive from './mod-node.ts'
import { describe, test, assert } from 'vitest'

describe('freezeModNodeRecursive', () => {
    test('freezes a leaf into its cached number', () => {
        const frozen = freezeModNodeRecursive(leaf('a', 5))
        assert.equal(frozen.displayName, 'a')
        assert.equal(frozen.total, 5)
        assert.equal(frozen.children.length, 0)
    })

    test('nested sum: parent total + child totals/names preserved', () => {
        const root = newModNode('root', [leaf('a', 2), leaf('b', 3)], sumFunc)
        const frozen = freezeModNodeRecursive(root)

        assert.equal(frozen.total, 5)
        assert.equal(frozen.children.length, 2)
        assert.deepEqual(
            frozen.children.map(c => [c.displayName, c.total]),
            [['a', 2], ['b', 3]],
        )
    })

    test('non-sum folds are preserved (uses each node own total)', () => {
        const product = newModNode('product', [leaf('a', 2), leaf('b', 3), leaf('c', 4)], productFunc)
        assert.equal(freezeModNodeRecursive(product).total, 24)

        const max = newModNode('max', [leaf('a', 2), leaf('b', 9), leaf('c', 4)], maxFunc)
        assert.equal(freezeModNodeRecursive(max).total, 9)
    })

    test('frozen is snapshotted even if the original ModNode changes', () => {
        // a leaf whose value is read from a mutable closure, so root.total() is live
        let base = 10
        const mutableLeaf: ModNode = {
            displayName: 'mutable',
            children: [],
            total: () => base,
        }
        const root = newModNode('root', [mutableLeaf, leaf('const', 1)], sumFunc)

        const frozen = freezeModNodeRecursive(root)
        assert.equal(frozen.total, 11)
        assert.equal(frozen.children[0].total, 10)

        // mutate the source: the live tree changes...
        base = 99
        assert.equal(root.total(), 100)
        // ...but the earlier snapshot stayed put
        assert.equal(frozen.total, 11)
        assert.equal(frozen.children[0].total, 10)
    })

    test('structural independence from the source tree', () => {
        const child = leaf('a', 2)
        const root = newModNode('root', [child], sumFunc)
        const frozen = freezeModNodeRecursive(root)

        assert.notEqual(frozen, root as unknown)
        assert.notEqual(frozen.children, root.children as unknown)
        assert.notEqual(frozen.children[0], child as unknown)
    })
})

describe('Integration: attack', () => {
    test('works', () => {
        const owner = createDefaultOwner()
        const node = attack(owner)
        assert.equal(node.total(), 3)

        const frozen = freezeModNodeRecursive(node)
        assert.equal(node.total(), frozen.total)
    })

    test('modNodeToText renders the frozen tree identically to the live tree', () => {
        const owner = createDefaultOwner()
        const node = attack(owner)
        const frozen = freezeModNodeRecursive(node)

        assert.equal(modNodeToText(frozen), modNodeToText(node))
    })
})

describe('modNodeToText: frozen matches live', () => {
    test('nested mixed-fold tree renders identically', () => {
        const root = newModNode('root', [
            newModNode('sum', [leaf('a', 2), leaf('b', 3)], sumFunc),
            newModNode('product', [leaf('c', 4), leaf('d', 5)], productFunc),
            leaf('constant', 7),
        ], sumFunc)

        assert.equal(modNodeToText(freezeModNodeRecursive(root)), modNodeToText(root))
    })
})
