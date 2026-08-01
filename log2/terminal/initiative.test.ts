import { findNodeMatching, leaf } from '..'
import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import { Feat2 } from '../../feat2'
import initiative from './initiative'
import { describe, test, assert, expect } from 'vitest'

describe('initiative', () => {
    test('Feats and CS apply', () => {
        const init: Feat2 = {
            displayName: 'init-feat',
            broadContexts: {
                'initiative-feat-mod': (o: OwnerMaximal) => leaf('init-feat', 4)
            }
        }

        const owner = createDefaultOwner({
            cs: {
                dex: 14,
            },
            fs: {
                init,
            }
        })

        const node = initiative(owner)
        const f0 = findNodeMatching(node, /initiative/, {
            includeRoot: true,
        })
        assert.exists(f0)
        assert.equal(node.total(), 6)

        const f1 = findNodeMatching(node, /modded-dex/)
        const f2 = findNodeMatching(node, /init-feat/)

        assert.exists(f1)
        assert.exists(f2)
        assert.equal(f1.total(), 2)
        assert.equal(f2.total(), 4)
    })
})