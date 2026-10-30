import { describe, test, assert } from 'vitest'
import registry, { ignite } from './registry'

describe('registry', () => {
    test('Behavior', () => {
        const ign = registry['ignite']
        assert.exists(ign)

        // is a pointer
        assert.equal(ign, ignite)
    })
})
