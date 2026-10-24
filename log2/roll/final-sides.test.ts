import { createDefaultOwner } from '../../actor2/index.ts'
import modNodeToText from '../format.ts'
import { findNodeMatching, leaf } from '../index.ts'
import finalSides from './final-sides.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Final sides', () => {
    test('Returns the base dice sides when there is no modifier', () => {
        const owner = createDefaultOwner()

        const node = finalSides(20)(owner)

        assert.equal(node.displayName, 'maximum-dice-sides')
        assert.equal(node.total(), 20)
        assert.equal(node.children.length, 1)

        const base = findNodeMatching(node, /original-dice-sides/)
        assert.exists(base)
        assert.equal(base.total(), 20)
    })

    test('Builds dice-sides -> attack-sides-mod -> attack-sides-plus when modified', () => {
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

        const node = finalSides(20, 'attack-sides-mod')(owner)

        const f0 = findNodeMatching(node, /dice-sides$/, {
            includeRoot: true
        })
        assert.exists(f0)
        assert.equal(f0.total(), 22)
        assert.equal(f0.children.length, 2)

        const base = findNodeMatching(node, /original-dice-sides/)
        assert.exists(base)
        assert.equal(base.total(), 20)

        const f1 = findNodeMatching(node, /attack-sides-mod/)
        assert.exists(f1)
        assert.equal(f1.total(), 2)

        const f2 = findNodeMatching(node, /attack-sides-plus/)
        assert.exists(f2)
        assert.equal(f2.total(), 2)

        /* console.log(modNodeToText(node)) */
    })

    test('Does not apply to other roll types', () => {
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

        const node = finalSides(20, 'damage-sides-mod')(owner)

        /* console.log(modNodeToText(node)) */
        assert.equal(node.total(), 20)
        assert.equal(node.children.length, 1)

        const base = findNodeMatching(node, /original-dice-sides/)
        assert.exists(base)
        assert.equal(base.total(), 20)
    })
})
