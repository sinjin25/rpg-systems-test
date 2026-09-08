import { describe, test, expect, assert } from 'vitest'
import { createDefaultOwner } from '../../actor2'
import { leaf, findNodeMatching } from '..'
import healOverTime from '../terminal/heal-over-time'
import healOverTimeTaken from './heal-over-time-taken'

describe('heal-over-time-taken (terminal)', () => {
    const creator = createDefaultOwner({
        fs: {
            'regen-mastery': {
                displayName: 'regen-mastery',
                broadContexts: {
                    'heal-over-time-feat-mod': () => leaf('regen-mastery', 4)
                }
            }
        }
    })
    const receiver = createDefaultOwner({
        fs: {
            'fast-healer': {
                displayName: 'fast-healer',
                broadContexts: {
                    'heal-over-time-taken-feat-mod': () => leaf('fast-healer', 3)
                }
            }
        }
    })

    test('heal-over-time-taken', () => {
        // hot can be modified by creator (baseline + feat)
        const hotNode = healOverTime(leaf('regen', 4))(creator)
        assert.equal(hotNode.total(), 8)

        // final calc modified by receiver's feat
        const node = healOverTimeTaken({
            node: hotNode,
        })(receiver)

        const f0 = findNodeMatching(node, /heal-over-time-taken$/, {
            includeRoot: true,
        })
        const f1 = findNodeMatching(node, /heal-over-time-taken-feat-mod/)
        const f2 = findNodeMatching(node, /fast-healer/)
        const f3 = findNodeMatching(node, /incoming-heal/)
        const f4 = findNodeMatching(node, /regen-mastery/)
        const f5 = findNodeMatching(node, /regen/)
        for (let x of [f0, f1, f2, f3, f4, f5]) {
            assert.exists(x)
        }

        assert.equal(f0!.total(), 11) // 8 incoming + 3 receiver feat
        assert.equal(f2!.total(), 3)
        assert.equal(f3!.total(), 8)
    })

    test('heal-over-time-taken clamps at zero', () => {
        const receiverBlocked = createDefaultOwner({
            fs: {
                'no-heals': {
                    displayName: 'no-heals',
                    broadContexts: {
                        'heal-over-time-taken-feat-mod': () => leaf('no-heals', -100)
                    }
                }
            }
        })
        const node = healOverTimeTaken({
            node: leaf('regen', 4),
        })(receiverBlocked)
        assert.equal(node.total(), 0)
    })
})
