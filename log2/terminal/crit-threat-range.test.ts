import { describe, test, expect } from 'vitest'
import critThreatRange from './crit-threat-range'
import { createDefaultOwner } from '../../actor2'
import { OwnerLog2 } from '../types'
import { Weapon } from '../../equipment-sheet'
import { leatherArmor } from '../../defaults/equipment'
import { findNodeMatching, leaf } from '..'
import improvedCritical from '../feats/improved-critical'
import modNodeToText from '../format'

describe('crit-threat-range (terminal)', () => {
    const owner = createDefaultOwner()
    test('defaults to 20 when the weapon declares no critRange and no feats apply', () => {
        const node = critThreatRange(owner)
        expect(node.total()).toBe(20)
        expect(node.children.length).toBe(2) // weapon base (or default) and featmod
        expect(findNodeMatching(node, /crit-threat-range-mod/i)?.total()).toBe(0)
    })

    test('Weapons can use broadContext to declare a base', () => {
        const owner = createDefaultOwner({
            es: {
                mainhand: {
                    displayName: 'rapier',
                    broadContexts: {
                        'crit-threat-range': (o: OwnerLog2) => leaf('rapier', 18)
                    }
                }
            }
        })
        const node = critThreatRange(owner)
        expect(node.total()).toBe(18)
    })

    test('Feats can modify the range (and are negative)', () => {
        const owner = createDefaultOwner({
            fs: {
                improvedCritical
            }
        })
        const node = critThreatRange(owner)
        expect(node.total()).toBe(19) // base 20 + (-1)
        const mod = findNodeMatching(node, /crit-threat-range-mod/i)
        expect(mod?.total()).toBe(-1)
        expect(findNodeMatching(mod!, /improved-critical/i)).toBeTruthy()
        /* console.log(modNodeToText(node)) */
    })

    test('throws when no relevantSlot is provided', () => {
        const owner = createDefaultOwner({})
        owner.relevantSlot = undefined
        expect(() => critThreatRange(owner)).toThrow(/relevant/i)
    })
})
