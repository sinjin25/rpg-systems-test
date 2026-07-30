import { describe, test, expect, assert } from 'vitest'
import maxDexOfEquipmentPiece from './max-dex-of-equipment-piece'
import { armors } from '../../equipment-sheet2/defaults'
import { BaseEquipment } from '../../equipment-sheet'
import { createDefaultOwner } from '../defaults'
import { findNodeMatching } from '..'

const owner = createDefaultOwner({
    es: {
        armor: armors.plate
    }
})

describe('max-dex-of-equipment-piece', () => {
    test('reports the piece\'s cap', () => {
        const n = maxDexOfEquipmentPiece(owner.es.armor!)(owner)
        assert.exists(n)
        assert.equal(n.total(), 1)

        // is named the equipment piece
        const f0 = findNodeMatching(n, /max-dex-of-equipment-piece/, {
            includeRoot: true
        })
        assert.notExists(f0)

        const f1 = findNodeMatching(n, /plate/)
        assert.exists(f1)
        assert.equal(f1.total(), 1)
    })

    test('No relevant broadContext means undefined', () => {
        const n = maxDexOfEquipmentPiece(owner.es.mainhand!)(owner)
        assert.notExists(n)
    })
})
