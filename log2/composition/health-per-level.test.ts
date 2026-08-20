import { describe, test, expect, assert } from 'vitest'
import healthPerLevel from './health-per-level'
import { createDefaultOwner } from '../../actor2'
import bearsEndurance from '../../status-sheet2/status/bears-endurance'
import { inst } from '../../status-sheet2/testing'
import { findNodeMatching } from '..'
import modNodeToText from '../format'

const perLevel = (con: number, extra = {}) =>
    healthPerLevel(createDefaultOwner({ cs: { con }, ...extra })).total()

describe('health-per-level', () => {
    test('is the 10 base plus the con modifier', () => {
        expect(perLevel(10)).toBe(10) // +0
        expect(perLevel(14)).toBe(12) // +2
    })

    test('a con penalty subtracts from the base', () => {
        expect(perLevel(8)).toBe(9) // -1
    })

    test('con statuses are folded in through modded-con', () => {
        const node = healthPerLevel(createDefaultOwner({ cs: { con: 14 }, ss: { con: [inst(bearsEndurance)] } }))
        console.log(modNodeToText(node))
        expect(node.total()).toBe(16) // 10 + (14 + 8 - 10 => +6)
        assert.exists(findNodeMatching(node, /modded-con/))
    })
})
