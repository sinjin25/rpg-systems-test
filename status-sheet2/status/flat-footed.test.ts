import { describe, test, expect, assert } from 'vitest'
import flatFooted from './flat-footed'
import { createDefaultOwner } from '../../actor2'
import maxDexOfEquipment from '../../log2/composition/max-dex-of-equipment'
import { findNodeMatching } from '../../log2'
import { inst } from '../testing'
import { addStatusToStatusSheet, getStatusKey } from '../add-status-to-status-sheet'
import modNodeToText from '../../log2/format'
import { ac } from '../../log2/terminal'

describe("cats-grace", () => {
    test('registers a +4 dex-from-status contribution', () => {
        const owner = createDefaultOwner({})
        addStatusToStatusSheet(owner, owner, flatFooted(10))

        const obj = owner.ss[getStatusKey(flatFooted(9999))]![0]!
        if (!obj.expiration) throw Error('expected status to appear')
        if (obj.expiration.kind !== 'speed-elapsed') throw Error('expected speed elapsed type')

        assert.equal(obj.expiration.remaining, 10)

        // Forces max dex to 0
        const node = maxDexOfEquipment(owner)
        assert.exists(node)
        assert.equal(node.total(), 0)

        // find the node
        const f0 = findNodeMatching(node, /flat-footed/)
        assert.exists(f0)
    })

    test('Does nothing to a negative dex mod', () => {
        const owner = createDefaultOwner({
            cs: {
                dex: 8,
            }
        })

        const result0 = ac(owner)

        addStatusToStatusSheet(owner, owner, flatFooted(10))
        const result1 = ac(owner)

        assert.equal(result1.total(), result0.total())
    })
})
