import { describe, test, expect, assert } from 'vitest'
import flatFooted from './flat-footed'
import { createDefaultOwner } from '../../actor2'
import maxDexOfEquipment from '../../log2/composition/max-dex-of-equipment'
import { findNodeMatching } from '../../log2'

describe("cats-grace", () => {
    test('registers a +4 dex-from-status contribution', () => {
        const owner = createDefaultOwner({})

        owner.ss['flatFooted'] = flatFooted(10)

        const obj = owner.ss['flatFooted']!
        if (!obj.expiration) throw Error('expected status to appear')
        if (obj.expiration.kind !== 'speed-elapsed') throw Error('expected speed elapsed type')

        assert.equal(obj.expiration.remaining, 10)


        const contribution = obj.broadContexts['max-dex-of-equipment']!

        expect(contribution(createDefaultOwner({}))!.total()).toBe(0)

        // Forces max dex to 0
        const node = maxDexOfEquipment(owner)
        assert.exists(node)
        assert.equal(node.total(), 0)

        // find the node
        const f0 = findNodeMatching(node, /flat-footed/)
        assert.exists(f0)
    })
})
