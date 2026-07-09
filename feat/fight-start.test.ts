import { describe, test, assert } from 'vitest'
import { createDefaultOwner } from '../defaults/index.ts'
import { applyFightStartFeats } from './fight-start.ts'
import { featDivineProtection } from './feats/divine-protection.ts'
import { featMeleeWeaponFighting } from './feats/index.ts'

describe('applyFightStartFeats', () => {
    test('grants the status returned by a feat with onFightStart', () => {
        const owner = createDefaultOwner({ fs: { featDivineProtection } })
        applyFightStartFeats(owner)
        assert.property(owner.ss, 'featDivineProtection')
        assert.equal(owner.ss.featDivineProtection.displayName, 'Divine Protection')
    })

    test('is a no-op for feats without onFightStart', () => {
        const owner = createDefaultOwner({ fs: { featMeleeWeaponFighting } })
        applyFightStartFeats(owner)
        assert.deepEqual(owner.ss, {})
    })

    test('is a no-op when the feat sheet is empty', () => {
        const owner = createDefaultOwner({})
        applyFightStartFeats(owner)
        assert.deepEqual(owner.ss, {})
    })
})
