import { Feat2 } from '../../feat2/types'
import { deserializeFeatSheet, serializeFeatSheet } from './feat-sheet.ts'
import { describe, test, assert, expect } from 'vitest'
import { createDefaultOwner } from '../../actor2'

describe('deserializeFeatSheet', () => {
    test('Needs a fallback for enemies/test feats to deserialize', () => {
        // this is not necessarily a problem because registries are pointer anyway
        const fakeFeat: Feat2 = {
            id: 'random',
            hidden: false,
            displayName: 'random',
            broadContexts: {},
        }

        const owner = createDefaultOwner({
            fs: { [fakeFeat.id]: fakeFeat }
        })

        const serialize = serializeFeatSheet(owner.fs)
        assert.equal(serialize.length, 1)

        const fallbackDe = deserializeFeatSheet(serialize, owner.fs)
        assert.exists(fallbackDe['random'])

        const noFallbackDe = deserializeFeatSheet(serialize)
        assert.notExists(noFallbackDe['random'])
    })
})
