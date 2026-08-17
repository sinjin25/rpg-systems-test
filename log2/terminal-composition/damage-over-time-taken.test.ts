import { describe, test, expect, assert } from 'vitest'
import damageTaken from './damage-taken'
import critDamage from '../terminal/crit-damage'
import { createDefaultOwner } from '../../actor2'
import { ObjectWithBroadContexts, OwnerLog2 } from '../types'
import studiedTarget from '../../status-sheet2/status/studied-target'
import defensiveRoll from '../../status-sheet2/status/defensive-roll'
import { leaf, findNodeMatching } from '..'
import { setSeed, clearSeed } from '../../roll'
import modNodeToText from '../format'
import damageOverTime from '../terminal/damage-over-time'
import damageOverTimeTaken from './damage-over-time-taken'

describe('damage-taken (terminal)', () => {
    const creator = createDefaultOwner({
        fs: {
            'dots-do-more': {
                displayName: 'dots-do-more',
                broadContexts: {
                    'damage-over-time-feat-mod': () => leaf('dots-do-more', 4)
                }
            }
        }
    })
    const receiver = createDefaultOwner({
        fs: {
            'decrease-dot': {
                displayName: 'decrease-dot',
                broadContexts: {
                    'damage-over-time-taken-feat-mod': () => leaf('decrease-dot', -2)
                }
            }
        }
    })

    test('damage-over-time-taken', () => {
        // dot can be modified by creator
        const dotNode = damageOverTime(leaf('ignite', 4))(creator)
        assert.equal(dotNode.total(), 8)

        // final calc by be modified by receiver
        const node = damageOverTimeTaken({
            node: dotNode,
        })(receiver)

        /* console.log(modNodeToText(node)) */

        // prints expected tag
        const f0 = findNodeMatching(node, /damage-over-time-taken/, {
            includeRoot: true,
        })
        const f1 = findNodeMatching(node, /damage-over-time-taken-feat-mod/)
        const f2 = findNodeMatching(node, /decrease-dot/)
        // find foreign tags
        const f3 = findNodeMatching(node, /incoming-damage/)
        const f4 = findNodeMatching(node, /dots-do-more/)
        const f5 = findNodeMatching(node, /ignite/)
        for (let x of [f0, f1, f2, f3, f4, f5]) {
            assert.exists(x)
        }

        assert.equal(f0!.total(), 6)
        assert.equal(f2!.total(), -2)
        assert.equal(f3!.total(), 8)
    })
})
