import { findNodeMatching, leaf } from '..'
import { createDefaultOwner } from '../../actor2'
import modNodeToText from '../format.ts'
import damageOverTime from './damage-over-time.ts'
import { describe, test, assert, expect } from 'vitest'

describe('damage-over-time', () => {
    test('Accepts a foreign node (usually defined on StatusEffect', () => {
        const l = leaf('my dot', 4)
        const owner = createDefaultOwner({
            fs: {
                'dot-feat': {
                    displayName: 'dot-feat',
                    broadContexts: {
                        'damage-over-time-feat-mod': () => leaf('dot-feat', 4)
                    }
                }
            }
        })
        const node = damageOverTime(l)(owner)

        /* console.log(modNodeToText(node)) */
        const f0 = findNodeMatching(node, /damage-over-time/, {
            includeRoot: true,
        })
        assert.exists(f0)
        assert.equal(f0.total(), 8)

        // includes foreign node
        const f1 = findNodeMatching(node, /my dot/)
        assert.exists(f1)
        assert.equal(f1.total(), 4)

        // works with feats
        const f2 = findNodeMatching(node, /dot-feat/)
        assert.exists(f2)
        assert.equal(f2.total(), 4)

        // filed under a subcalc
        const f3 = findNodeMatching(node, /damage-over-time-feat-mod/)
        assert.exists(f3)
    })
})