import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import modNodeToText from '../format.ts'
import { findNodeMatching, leaf } from '../index.ts'
import { hasAllTags, hasAnyTag } from '../tags.ts'
import { OwnerLog2 } from '../types.ts'
import dc from './dc.ts'
import { describe, test, assert, expect } from 'vitest'

describe('terminal: dc', () => {
    const owner = createDefaultOwner({})
    test('Sums mods', () => {
        const node = dc({
            baseDc: 15,
            tags: ['ability']
        })(owner)

        // terminal name is correct
        const f0 = findNodeMatching(node, 'dc', {
            includeRoot: true,
        })
        assert.exists(f0)
        assert.equal(node.total(), 17)
    })

    test('Breakdown sums', () => {
        const owner = createDefaultOwner({
            fs: {
                'spell-feat': {
                    displayName: 'spell-feat',
                    broadContexts: {
                        'spell-dc-feat-mod': () => leaf('spell-feat', 2)
                    }
                },
                'swag-casting': {
                    displayName: 'swag-casting',
                    broadContexts: {
                        'spell-dc-feat-mod': (o: OwnerLog2) => hasAllTags(o.tags, ['ability', 'magic']) ? leaf('swag-casting', 2) : undefined
                    }
                },
                'ability-casting': {
                    displayName: 'ability-casting',
                    broadContexts: {
                        'spell-dc-feat-mod': (o: OwnerLog2) => hasAnyTag(o.tags, ['ability'], ['magic']) ? leaf('ability-casting', 2) : undefined
                    }
                }
            }
        })

        const node = dc({
            baseDc: 15,
            tags: ['ability', 'magic']
        })(owner)

        /* console.log(modNodeToText(node)) */

        // provides a base dc
        const f0 = findNodeMatching(node, /base-dc/)
        assert.exists(f0)
        assert.equal(f0.total(), 15)

        // sums int
        const f1 = findNodeMatching(node, /effective-spell-dc-stat/)
        assert.exists(f1)
        assert.equal(f1.total(), 2)

        // sums feats
        const f2 = findNodeMatching(node, /spell-dc-feat-mod/)
        assert.exists(f2)
        assert.equal(f2.total(), 4)

        // does not use improper feats
        const f3 = findNodeMatching(node, /ability-casting/)
        assert.notExists(f3)

        const f4 = findNodeMatching(node, /spell-dc-from-equipment/)
        assert.equal(f4!.total(), 0)
    })
})