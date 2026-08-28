import { findNodeMatching, leaf } from '..'
import { createDefaultOwner } from '../../actor2'
import featContribution from '../composition/feat-contribution.ts'
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

    test('a preCalc replaces the live feat mod and the child keeps the preCalc node name', () => {
        // an owner whose feat WOULD contribute on the live path
        const owner = createDefaultOwner({
            fs: {
                'dot-feat': {
                    displayName: 'dot-feat',
                    broadContexts: {
                        'damage-over-time-feat-mod': () => leaf('live-feat-mod', 99)
                    }
                }
            }
        })

        // real statuses snapshot featContribution('damage-over-time-feat-mod'), which is
        // named canonically, so the child reads 'damage-over-time-feat-mod' as expected.
        const snapshot = featContribution('damage-over-time-feat-mod')(createDefaultOwner({
            fs: {
                'src-feat': {
                    displayName: 'src-feat',
                    broadContexts: {
                        'damage-over-time-feat-mod': () => leaf('src-feat', 3)
                    }
                }
            }
        }))
        const node = damageOverTime(leaf('my dot', 4))(owner, {}, snapshot)

        // the live feat mod (99) is NOT computed — total is 4 + 3, not 4 + 99
        assert.equal(node.total(), 7)
        assert.notExists(findNodeMatching(node, /live-feat-mod/))

        // the canonical label survives via the snapshot's own name
        assert.exists(findNodeMatching(node, /damage-over-time-feat-mod/))
        assert.exists(findNodeMatching(node, /src-feat/))
    })

    test('the child name is only as good as the preCalc: a bare leaf shows its own name, not the subproblem key', () => {
        // Object.values(subproblems) drops the key, so a poorly-named preCalc (e.g. the
        // tick.test.ts fixture leaf('mod', 0)) surfaces literally as "mod".
        const node = damageOverTime(leaf('my dot', 4))(createDefaultOwner(), {}, leaf('mod', 0))

        assert.exists(findNodeMatching(node, /^mod$/))
        assert.notExists(findNodeMatching(node, /damage-over-time-feat-mod/))
        assert.equal(node.total(), 4)
    })
})