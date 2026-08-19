import { describe, test, assert } from 'vitest'
import { createDefaultOwner } from '../../actor2'
import { leaf } from '../../log2'
import { makeWrapper, newStatusInstance } from './index'

describe('makeWrapper / newStatusInstance', () => {
    test('defaults stack to highest and mints an instance pointing back at the definition', () => {
        const w = makeWrapper({ displayName: 'buff', broadContexts: {} })
        assert.equal(w.stack.kind, 'highest')

        const source = createDefaultOwner()
        const inst = newStatusInstance(w, source)
        assert.equal(inst.pointer.displayName, 'buff')
        assert.equal(inst.source, source)
        assert.equal(inst.expiration, undefined)
    })

    test('passes expiration through and freezes the tick mod once, at apply time', () => {
        let modCalls = 0
        const w = makeWrapper({
            displayName: 'dot',
            broadContexts: {},
            tick: {
                calculateDamage: {
                    base: () => leaf('base', 4),
                    mod: () => { modCalls++; return leaf('mod', 2) },
                },
            },
        }, { expiration: { kind: 'rounds-elapsed', remaining: 3 } })

        const inst = newStatusInstance(w, createDefaultOwner())

        // mod is resolved exactly once (the snapshot); base stays a per-tick thunk
        assert.equal(modCalls, 1)
        assert.equal(typeof inst.tick!.calculateDamage!.base, 'function')
        assert.equal(inst.tick!.calculateDamage!.mod.total(), 2)
        assert.deepEqual(inst.expiration, { kind: 'rounds-elapsed', remaining: 3 })
    })
})
