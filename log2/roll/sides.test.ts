import { createDefaultOwner } from '../../actor2/index.ts'
import modNodeToText from '../format.ts'
import { findNodeMatching, leaf } from '../index.ts'
import sides from './sides.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Sides', () => {
    test('Can be modified', () => {
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

        const node = sides('attack-sides-mod')(owner)!

        const f0 = findNodeMatching(node, /attack-sides-mod/, {
            includeRoot: true
        })
        assert.exists(f0)
        assert.equal(f0.total(), 2)

        const f1 = findNodeMatching(node, /attack-sides-plus/)
        assert.exists(f1)
        assert.equal(f1.total(), 2)

        // doesnt apply to other mods
        const node2 = sides('damage-sides-mod')(owner)
        assert.notExists(node2)
    })
    test('Returns undefined if no relevant boosts', () => {
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

        const node2 = sides('damage-sides-mod')(owner)
        assert.notExists(node2)
    })
})