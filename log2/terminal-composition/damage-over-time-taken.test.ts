import { describe, test, expect, assert } from 'vitest'
import damageTaken from './damage-taken'
import critDamage from '../terminal/crit-damage'
import { createDefaultOwner, instantiateActor, OwnerMaximal } from '../../actor2'
import { ObjectWithBroadContexts, OwnerLog2 } from '../types'
import studiedTarget from '../../status-sheet2/status/studied-target'
import defensiveRoll from '../../status-sheet2/status/defensive-roll'
import { leaf, findNodeMatching } from '..'
import { setSeed, clearSeed } from '../../roll'
import modNodeToText from '../format'
import damageOverTime from '../terminal/damage-over-time'
import damageOverTimeTaken from './damage-over-time-taken'
import { addStatusToStatusSheet, getStatusKey, makeWrapper } from '../../status-sheet2'
import featContribution from '../composition/feat-contribution'
import { calculateDamageTicks } from '../../status-sheet2/tick'

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
    const stackingDot = makeWrapper({
        broadContexts: {},
        displayName: 'stacking-dot',
        stack: {
            kind: 'stack',
        },
        tick: {
            calculateDamage: {
                base: () => leaf('stacking-dot', 4),
                mod: (source: OwnerMaximal) => featContribution('damage-over-time-feat-mod')(source),
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

    test('Confirm stacking kind = stack behavior', () => {
        const o = creator // has dot-plus
        const a = instantiateActor(o)

        // add twice
        addStatusToStatusSheet(o, o, stackingDot, stackingDot)
        assert.equal(o.ss[getStatusKey(stackingDot)].length, 2)

        const cdt = calculateDamageTicks(a)
        console.log(cdt)
        assert.equal(cdt.length, 2)

        // each instance of a stacked dot is its own damage calculation
        const cdt0 = cdt[0]!

        assert.equal(cdt0.node.total(), 8)
        console.log(modNodeToText(cdt0.node))
    })
})
