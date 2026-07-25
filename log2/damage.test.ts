import { describe, test, assert } from 'vitest'
import { newModNode, leaf, rollNode, productFunc, mapFunc, sumFunc, Roller, ModNode } from './index.ts'
import { modNodeToText } from './format.ts'

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

const die = (name: string, sides: number, roller: Roller) =>
    rollNode(name, newModNode('Sides', [leaf('Base', sides)]), roller)

// stat -> modifier, the way stat-modifier/index.ts does it
const statToMod = (stat: number) => {
    const raw = stat - 10
    return raw >= 0 ? Math.floor(raw / 2) : Math.ceil(raw / 2)
}

// rebuilds the Damage tree from scratch.txt. rolls are scripted in tree order:
// longsword d8 -> 5, spirit hunter d6 -> 4, smite d4 -> 2
const scratchDamageTree = (roller = scriptedRoller(5, 4, 2)) => {
    const longsword = newModNode('Longsword +2', [
        die('Roll', 8, roller),
        leaf('Enhancement', 2),
        newModNode('Spirit Hunter Class Enhancement', [die('Roll', 6, roller)]),
    ])

    const baseAttackBonus = newModNode('Base Attack bonus', [
        leaf('Slayer', 4),
        leaf('Fighter', 1),
    ])

    // power attack scales one extra multiple per 4 points of BAB
    const multCount = newModNode('Mult Count', [
        leaf('Base', 1),
        newModNode('From BAB', [baseAttackBonus], mapFunc(bab => Math.floor(bab / 4))),
    ])

    // 2 damage *per* multiple - a product, not a sum. the two happen to agree at
    // these numbers (2 and 2), so the rule is pinned here rather than inferred
    const powerAttack = newModNode('Power Attack', [leaf('Base', 2), multCount], productFunc)

    const critScaling = newModNode('Crit Scaling Damage', [
        newModNode('Weapon', [longsword]),
        newModNode('Feats', [powerAttack, leaf('Weapon Mastery', 1)]),
    ])

    // the crit multiplier is a child, not a captured constant
    const crit = newModNode('Crit', [leaf('Crit Multi', 3), critScaling], productFunc)

    const smite = newModNode('Smite on Crit', [
        leaf('Base', 3),
        newModNode('Int Mod', [leaf('Base', 14)], mapFunc(statToMod)),
        die('Roll', 4, roller),
    ])

    return newModNode('Damage', [crit, newModNode('Non-Scaling', [smite])])
}

describe('log2 renders the scratch damage tree', () => {
    test('the crit branch matches the sketch exactly', () => {
        const damage = scratchDamageTree()

        assert.equal(find('Base Attack bonus', damage)!.total(), 5)
        assert.equal(find('From BAB', damage)!.total(), 1, 'floor(5 / 4)')
        assert.equal(find('Mult Count', damage)!.total(), 2)
        assert.equal(find('Power Attack', damage)!.total(), 4)
        assert.equal(find('Longsword +2', damage)!.total(), 11, 'd8 roll 5 + 2 enhancement + 4 spirit hunter')
        assert.equal(find('Crit Scaling Damage', damage)!.total(), 16)
        assert.equal(find('Crit', damage)!.total(), 48, '3 x 16 - a product, not a sum')
    })

    test('Int Mod converts a raw stat the way the game does', () => {
        const damage = scratchDamageTree()
        assert.equal(find('Int Mod', damage)!.total(), 2, 'int 14 -> +2')
    })

    test('the non-scaling branch is a plain sum of its three children', () => {
        const damage = scratchDamageTree()
        const smite = find('Smite on Crit', damage)!

        // base 3 + int mod 2 + d4 roll 2
        assert.deepEqual(smite.children.map(c => c.total()), [3, 2, 2])
        assert.equal(smite.total(), 7)
        assert.equal(damage.total(), 55, '48 crit + 7 non-scaling')
    })

    test('renders the outline', () => {
        console.log('\n' + modNodeToText(scratchDamageTree()))
    })
})

describe('what the damage tree exercises', () => {
    test('power attack is a product where sum and product diverge', () => {
        // at BAB 12 the multiple count is 3: product gives 6, a sum would give 5
        const multCount = newModNode('Mult Count', [
            leaf('Base', 1),
            newModNode('From BAB', [leaf('Base Attack bonus', 12)], mapFunc(bab => Math.floor(bab / 4))),
        ])
        const powerAttack = newModNode('Power Attack', [leaf('Base', 2), multCount], productFunc)

        assert.equal(multCount.total(), 4)
        assert.equal(powerAttack.total(), 8, '2 per multiple x 4 multiples')
        assert.notEqual(powerAttack.total(), sumFunc(powerAttack.children))
    })

    test('product commutes, so child order does not matter', () => {
        const a = newModNode('Crit', [leaf('Crit Multi', 3), leaf('Scaling', 16)], productFunc)
        const b = newModNode('Crit', [leaf('Scaling', 16), leaf('Crit Multi', 3)], productFunc)
        assert.equal(a.total(), b.total())
    })

    test('dice appear at four different depths and each resolves once', () => {
        const damage = scratchDamageTree()
        const first = damage.total()
        assert.equal(damage.total(), first)
        assert.equal(damage.total(), first)
    })

    test('a bigger die changes the damage without touching the damage rule', () => {
        // the longsword rolls a d8; give it a d12 and only the Sides subtree changes
        const roller = scriptedRoller(11, 4, 2)
        const sides = newModNode('Sides', [leaf('Base', 8), leaf('Oversized', 4)])
        const upgraded = rollNode('Roll', sides, roller)

        assert.equal(sides.total(), 12)
        assert.equal(upgraded.total(), 11)
    })
})
