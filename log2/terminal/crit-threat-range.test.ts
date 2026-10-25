import { describe, test, expect } from 'vitest'
import critThreatRange from './crit-threat-range'
import { createDefaultOwner } from '../../actor2'
import { OwnerLog2 } from '../types'
import { findNodeMatching, leaf } from '..'
import improvedCritical from '../feats/improved-critical'
import modNodeToText from '../format'
import { SLOT_TYPE } from '../../equipment-sheet2/defaults'
import { BaseEquipment } from '../../equipment-sheet2/types'

const weaponWithNoCritRange: BaseEquipment = {
    displayName: 'weapon with no crit range',
    acceptableSlots: SLOT_TYPE.weapon,
    broadContexts: {},
}

describe('crit-threat-range (terminal)', () => {
    const owner = createDefaultOwner({ es: { mainhand: weaponWithNoCritRange } })
    test('defaults to 20 when the weapon declares no critRange and no feats apply', () => {
        const node = critThreatRange(owner)
        console.log(modNodeToText(node))
        expect(node.total()).toBe(20)
        expect(node.children.length).toBe(2) // weapon base (or default) and featmod
        expect(findNodeMatching(node, /crit-threat-range-mod/i)?.total()).toBe(0)
    })

    test('Weapons can use broadContext to declare a base', () => {
        const owner = createDefaultOwner({
            es: {
                mainhand: {
                    displayName: 'rapier',
                    acceptableSlots: SLOT_TYPE.weapon,
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
            es: { mainhand: weaponWithNoCritRange },
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

    test('the default range tracks a widened die instead of staying pinned to 20', () => {
        const owner = createDefaultOwner({
            es: { mainhand: weaponWithNoCritRange },
            fs: {
                attackSidesPlus: {
                    displayName: 'attack-sides-plus',
                    broadContexts: {
                        "attack-sides-mod": () => leaf('attack-sides-plus', 2)
                    }
                }
            },
        })
        const node = critThreatRange(owner)
        expect(node.total()).toBe(22)
        expect(findNodeMatching(node, /maximum-dice-sides/i)?.total()).toBe(22)
    })
})
