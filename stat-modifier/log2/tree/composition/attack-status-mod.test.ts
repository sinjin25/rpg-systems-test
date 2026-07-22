import { describe, test, expect } from 'vitest'
import attackStatusMod from './attack-status-mod'
import { createDefaultOwner } from '../../../../defaults'
import { dagger } from '../../../../defaults/equipment'
import { standardFilters } from '../../../../feat/core-types'
import { StatusEffect } from '../../../../status-sheet/core-types'
import bullsStrength from '../bases/status/bulls-strength'
import { asStatus } from '../../collect-status-contributions'

// LAYER: attack-status-mod bridges to the legacy context-tag engine, same as attack-feat-mod. These
// tests use a minimal legacy-format status (one that carries a `.context` map) to prove the bridge
// and the tag filtering. Default mainhand is the shortsword (['shortsword','melee']).

// +2 attack, but only on a melee weapon
const meleeBless: StatusEffect = {
    displayName: 'Melee Bless',
    context: {
        attack: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({ blacklist: [], whitelist: ['melee'] }),
            mod: () => 2,
        },
    },
    expiration: { kind: 'rounds-elapsed', remaining: 1 },
}

describe('attack-status-mod', () => {
    test('an applying status becomes a summed child leaf', () => {
        const node = attackStatusMod(createDefaultOwner({ ss: { meleeBless } }))
        expect(node.total()).toBe(2)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Melee Bless 2'])
    })

    test('tag filtering: the melee status is skipped when the weapon is not melee-tagged', () => {
        // dagger is ['finesse','dagger','melee'] - still melee, so instead prove the inverse with a
        // ranged-only whitelist against the melee shortsword
        const rangedOnly: StatusEffect = {
            ...meleeBless,
            displayName: 'Ranged Only',
            context: {
                attack: {
                    applies: standardFilters.noBlacklistAnyWhitelistFactory({ blacklist: [], whitelist: ['ranged'] }),
                    mod: () => 2,
                },
            },
        }
        const node = attackStatusMod(createDefaultOwner({ ss: { rangedOnly } }))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('no statuses -> 0, no children', () => {
        const node = attackStatusMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('a log2 broadContexts-only status (no legacy .context) contributes 0 here', () => {
        const node = attackStatusMod(createDefaultOwner({ ss: { bullsStrength: asStatus(bullsStrength) } }))
        expect(node.total()).toBe(0)
    })
})
