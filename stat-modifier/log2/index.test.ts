import { describe, test, assert } from 'vitest'
import { newModNode, leaf, minFunc, statSumFunc, maxFunc, sumFunc } from './index.ts'
import { modNodeToText } from './format.ts'

// rebuilds scratch.txt exactly - the hand-written AC 26 breakdown
const scratchAcTree = () => {
    const maxDex = newModNode('Max Dex', [
        newModNode('Chainmail', [leaf('Base', 4), leaf('Mythril', 1)]),
        leaf('Amulet', 1),
        leaf('Fighter Training', 1),
    ])

    // a +1 raw dex item contributes +0.5 in modifier space; the node rounds once
    const dexMod = newModNode('Dex Mod', [
        leaf('Base Dex', 3),
        leaf("Cat's Grace", 2),
        leaf('Amulet', .5),
    ], statSumFunc)

    // the cap is not additive with the modifier - the lower of the two wins
    const dex = newModNode('Dex', [maxDex, dexMod], minFunc)

    const armor = newModNode('Armor', [
        newModNode('Chainmail +2', [leaf('Base', 4), leaf('Enhancement', 2)]),
        newModNode('Shield', [leaf('Base', 2)]),
    ])

    const feats = newModNode('Feats', [
        leaf('Shield Mastery', 1),
        leaf('Medium Armor Mastery', 1),
        leaf('Dodgy', 1),
    ])

    return newModNode('AC', [leaf('Base AC', 10), dex, armor, feats])
}

describe('log2 reproduces scratch.txt', () => {
    test('every subtotal matches the hand-written tree', () => {
        const ac = scratchAcTree()
        const find = (name: string, from = ac): ModNodeLike => {
            if (from.displayName === name) return from
            for (const c of from.children) {
                const hit = find(name, c)
                if (hit) return hit
            }
            return undefined as unknown as ModNodeLike
        }

        assert.equal(find('Max Dex').total(), 7)
        assert.equal(find('Dex Mod').total(), 5, 'sums to 5.5, rounds to 5')
        assert.equal(find('Dex').total(), 5, 'min(7, 5), not 12')
        assert.equal(find('Armor').total(), 8)
        assert.equal(find('Feats').total(), 3)
        assert.equal(ac.total(), 26)
    })

    test('renders the scratch outline', () => {
        console.log('\n' + modNodeToText(scratchAcTree()))
    })
})

type ModNodeLike = ReturnType<typeof leaf>

describe('trees that probe the model', () => {
    test('BREAK? negative dex rounding', () => {
        // dex 7 (-1.5 in modifier space) with a +1 raw item (+0.5)
        const dexMod = newModNode('Dex Mod', [
            leaf('Base Dex', -1.5),
            leaf('Amulet', .5),
        ], statSumFunc)
        // -1.0 exactly, so rounding direction is not exercised here
        assert.equal(dexMod.total(), -1)

        // dex 7 with no help: -1.5 must round toward zero to -1, not down to -2
        const bare = newModNode('Dex Mod', [leaf('Base Dex', -1.5)], statSumFunc)
        assert.equal(bare.total(), -1, 'pathfinder rounds negatives toward zero')
    })

    test('BREAK? a min node with no children', () => {
        // no armor equipped means no cap - the Max Dex child should not be built at all
        assert.throws(() => newModNode('Dex', [], minFunc).total(), /at least one child/)
    })

    test('BREAK? children added after construction', () => {
        const feats = newModNode('Feats', [leaf('Dodgy', 1)])
        assert.equal(feats.total(), 1)
        feats.children.push(leaf('Shield Mastery', 1))
        assert.equal(feats.total(), 2, 'total() must re-read children, not close over them')
    })

    test('BREAK? a leaf that gains children lies about its total', () => {
        const l = leaf('Base AC', 10)
        l.children.push(leaf('surprise', 5))
        // constantFunc ignores children entirely - the outline would show a child
        // that contributes nothing, with no error
        assert.equal(l.total(), 10)
    })

    test('BREAK? pathfinder same-type bonuses do not stack', () => {
        // two enhancement bonuses: only the better one applies, then it sums with
        // a dodge bonus from a different type. one flat sum cannot express this -
        // it needs a grouping level keyed by bonus *type*, which displayName is not
        const enhancement = newModNode('enhancement', [
            leaf('Chainmail +2', 2),
            leaf("Mage's Bracers +1", 1),
        ], maxFunc)
        const dodge = newModNode('dodge', [leaf('Dodgy', 1)], sumFunc)
        const armor = newModNode('Armor', [enhancement, dodge])

        assert.equal(armor.total(), 3, 'max(2,1) + 1, not 2+1+1')
        // it works - but only because the tree was built with a type layer.
        // nothing in ModNode forces or records that the layer means "bonus type"
    })

    test('BREAK: total() is lazy, so a rolling node rerolls on every read', () => {
        let rolls = 0
        const bad = newModNode('d20', [], () => { rolls++; return (rolls * 7) % 20 })
        const a = bad.total()
        const b = bad.total()
        assert.notEqual(a, b, 'same node, two reads, two different numbers')

        // a roll has to be resolved once and stored as a leaf
        const good = leaf('d20', 14)
        assert.equal(good.total(), good.total())
    })

    test('BREAK? a multiplier node', () => {
        // crit multiplier is not additive with its siblings
        const damage = newModNode('Damage', [
            newModNode('base damage', [leaf('weapon', 6), leaf('str', 3)]),
            leaf('crit multiplier', 2),
        ], (children) => children[0].total() * children[1].total())

        assert.equal(damage.total(), 18)
        // works, but the totalFunc now depends on child *order*, not child identity
    })
})
