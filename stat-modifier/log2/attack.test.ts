import { describe, test, assert } from 'vitest'
import { newModNode, leaf, rollNode, maxFunc, avgFunc, mapFunc, Roller, ModNode } from './index.ts'
import { modNodeToText } from './format.ts'

// hands back the given rolls in order, so a tree with dice in it is still assertable
const scriptedRoller = (...results: number[]): Roller => {
    let i = 0
    return () => results[i++]
}

const find = (name: string, from: ModNode): ModNode | undefined => {
    if (from.displayName === name) return from
    for (const c of from.children) {
        const hit = find(name, c)
        if (hit) return hit
    }
    return undefined
}

// stat -> modifier, the way stat-modifier/index.ts does it
const statToMod = (stat: number) => {
    const raw = stat - 10
    return raw >= 0 ? Math.floor(raw / 2) : Math.ceil(raw / 2)
}

// rebuilds the Attack 30 tree from scratch.txt
const scratchAttackTree = (sidesChildren = [leaf('Base', 20)], roller = scriptedRoller(10, 20)) => {
    // each stat converts to a modifier at its OWN node - that is what the trailing
    // "Mod" in the sketch's node names means. Finesse then picks between two
    // modifiers; converting after the max would be comparing raw stats instead
    const weaponFinesse = newModNode('Weapon Finesse', [
        newModNode('Strength Mod', [leaf('Base', 11), leaf('Mutagen', 2)], mapFunc(statToMod)),
        newModNode('Dexterity Mod', [leaf('Base', 15), leaf("Cat's Grace", 6)], mapFunc(statToMod)),
    ], maxFunc)

    // already in modifier space by the time it gets here - a plain passthrough sum
    const baseMod = newModNode('Base Mod', [weaponFinesse])

    const modifier = newModNode('Modifier', [
        baseMod,
        newModNode('Equipment', [
            newModNode('Longsword +2', [leaf('Enhancement', 2)]),
            leaf('Amulet', 1),
        ]),
        newModNode('Status Effects', [leaf('Bless', 2), leaf('Rage', 2)]),
        newModNode('Feats', [
            leaf('Improved Rage', 1),
            leaf('Improved Bless', 1),
            leaf('Longsword Mastery', 1),
        ]),
    ])

    // sides is a subtree, so anything that grows the die is just another child
    const natural = rollNode('Natural Roll', newModNode('Sides', sidesChildren), roller)
    const second = rollNode('Second Roll', newModNode('Sides', sidesChildren), roller)

    const measured = newModNode('Measured Strike Average', [natural, second],
        mapFunc(Math.floor, avgFunc))

    return newModNode('Attack', [modifier, newModNode('Roll', [measured])])
}

describe('log2 renders the scratch attack tree', () => {
    test('every subtotal matches', () => {
        const attack = scratchAttackTree()

        assert.equal(find('Strength Mod', attack)!.total(), 1, 'stat 13 -> +1')
        assert.equal(find('Dexterity Mod', attack)!.total(), 5, 'stat 21 -> +5')
        assert.equal(find('Weapon Finesse', attack)!.total(), 5, 'max(1, 5), not 6')
        assert.equal(find('Base Mod', attack)!.total(), 5)
        assert.equal(find('Equipment', attack)!.total(), 3)
        assert.equal(find('Status Effects', attack)!.total(), 4)
        assert.equal(find('Modifier', attack)!.total(), 15)

        assert.equal(find('Natural Roll', attack)!.total(), 10)
        assert.equal(find('Second Roll', attack)!.total(), 20)
        assert.equal(find('Measured Strike Average', attack)!.total(), 15, 'avg(10, 20)')

        assert.equal(attack.total(), 30, 'modifier 15 + roll 15, matching the sketch')
    })

    test('renders the outline', () => {
        console.log('\n' + modNodeToText(scratchAttackTree()))
    })
})

describe('the die is a subtree', () => {
    test('an effect can grow the number of sides', () => {
        // beyond pathfinder: something that turns the d20 into a d24
        const sides = [leaf('Base', 20), leaf('Oversized Dice', 4)]
        const attack = scratchAttackTree(sides, scriptedRoller(22, 24))

        const sidesNode = find('Sides', attack)!
        assert.equal(sidesNode.total(), 24, 'the die itself is now explained by a subtree')
        // rolls above 20 are only reachable because sides grew
        assert.equal(find('Natural Roll', attack)!.total(), 22)
        assert.equal(find('Measured Strike Average', attack)!.total(), 23)

        console.log('\n' + modNodeToText(find('Natural Roll', attack)!))
    })

    test('the roller actually receives the sides total', () => {
        const seen: number[] = []
        const spy: Roller = (n) => { seen.push(n); return 1 }
        scratchAttackTree([leaf('Base', 20), leaf('Oversized Dice', 4)], spy)
        assert.deepEqual(seen, [24, 24], 'sides subtree folded before rolling')
    })

    test('a resolved die reports the same number every read', () => {
        const attack = scratchAttackTree()
        const nat = find('Natural Roll', attack)!
        assert.equal(nat.total(), nat.total())
        assert.equal(attack.total(), attack.total())
    })
})
