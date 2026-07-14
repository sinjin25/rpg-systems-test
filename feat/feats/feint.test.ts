import { describe, test, assert } from 'vitest'
import { createDefaultOwner } from '../../defaults/index.ts'
import { applyFightStartFeats } from '../fight-start.ts'
import { featFeint } from './feint.ts'

describe('featFeint', () => {
    test('grants the Feint status at fight start', () => {
        const owner = createDefaultOwner({ fs: { featFeint } })
        applyFightStartFeats(owner)
        assert.property(owner.ss, 'featFeint')
        assert.equal(owner.ss.featFeint.displayName, 'Feint')
    })
})
