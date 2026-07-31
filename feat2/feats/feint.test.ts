import { describe, test, assert } from 'vitest'
import featFeint from './feint.ts'
import applyFightStartFeats from '../../feat/fight-start.ts'
import { createDefaultOwner } from '../../actor2'

describe('featFeint', () => {
    test('grants the Feint status at fight start', () => {
        const owner = createDefaultOwner({ fs: { featFeint } })
        // @ts-expect-error
        applyFightStartFeats(owner)
        assert.property(owner.ss, 'featFeint')
        assert.equal(owner.ss.featFeint.displayName, 'Feint')
    })
})
