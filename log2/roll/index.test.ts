import { createDefaultOwner } from '../../actor2/index.ts'
import { shortsword } from '../../equipment-sheet2/defaults.ts'
import { iterate } from '../../simulate/util/iterate.ts'
import modNodeToText from '../format.ts'
import newModNode, { findNodeMatching, leaf, sumFunc } from '../index.ts'
import attack from '../terminal/attack.ts'
import rollTree from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('roll works', () => {
    test('Returns a ModNode with children that are rolls', () => {
        const owner = createDefaultOwner()
        const SIDES = 20
        const DICE = 30
        const node = rollTree(
            SIDES,
            DICE,
        )(owner)

        /* console.log(modNodeToText(node)) */

        const f0 = findNodeMatching(node, 'roll', {
            includeRoot: true,
        })
        assert.exists(f0)

        assert.equal(node.total() >= 20, true)
        assert.equal(node.children.length, DICE)

        // each dice is rolled independently
        const unique = new Set<number>()
        for (let n of node.children) {
            unique.add(n.total())
        }
        assert.equal(unique.size > 1, true)

        const f1 = findNodeMatching(node, /1d20/)
        assert.exists(f1)
    })
    test('Sides can be modified', () => {
        const owner = createDefaultOwner({
            fs: {
                attackSidesPlus: {
                    displayName: 'attack-sides-plus',
                    broadContexts: {
                        "attack-sides-mod": () => leaf('attack-sides-plus', 2)
                    }
                }
            },
        })

        const node = rollTree(6, 1, 'attack-sides-mod')(owner)
        console.log(modNodeToText(node))
        const f0 = findNodeMatching(node, /1d8/)
        const f1 = findNodeMatching(node, /attack-sides-mod/)
        const f2 = findNodeMatching(node, /attack-sides-plus/)
        console.log(modNodeToText(node))
        assert.exists(f0)
        assert.exists(f1)
        assert.exists(f2)

        const REPS = 100
        for (let i = 0; i < REPS; i++) {
            const myRoll = rollTree(6, 1, 'attack-sides-mod')(owner)
            assert.equal(myRoll.total() <= 6 + 2, true)
        }
    })
})

describe('Integration: attack', () => {
    test('works with attack', () => {
        const owner = createDefaultOwner({
            cs: {
                str: 14,
            },
            es: {
                mainhand: shortsword,
            },
            fs: {
                'attack': {
                    displayName: 'attack-plus',
                    broadContexts: {
                        'attack-feat-mod': () => leaf('attack-plus', 2),
                        'attack-sides-mod': () => leaf('attack-sides-plus', 2)
                    }
                }
            }
        })

        const results = new Set<number>()
        iterate(200, (i) => {
            const attackMod = attack(owner)
            const attackRoll = rollTree(20, 1, 'attack-sides-mod')(owner)
            const tree = newModNode(
                'attack',
                [attackMod, attackRoll],
                sumFunc,
            )
            results.add(tree.total())
            if (i === 0) console.log(modNodeToText(attackMod))
        })

        assert.equal(results.size, 22) // d20 + 2 sides
        const asArr = Array.from(results)
        let min = Infinity
        let max = -Infinity
        for (let a of asArr) {
            if (a <= min) min = a
            if (a >= max) max = a
        }
        assert.equal(max, 22 + 2 + 2 + 1)
        assert.equal(min, 1 + 2 + 2 + 1)
    })
})