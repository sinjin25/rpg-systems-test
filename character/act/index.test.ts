import { describe, test, assert } from 'vitest'
import { act } from './index.ts'
import { Ability, addAbility } from '../../ability-sheet/index.ts'
import ignite from '../../ability-sheet/abilities/ignite.ts'
import { createDefaultOwner, defaultEquipmentSheet } from '../../defaults/index.ts'
import { shortsword } from '../../defaults/equipment/index.ts'

// attack mechanics (rolls, mods, crits) are covered against useAttack directly in
// ./attack/index.test.ts; this file only covers how act composes a turn

const debuffAbility = (displayName: string, castType: Ability['castType']): Ability => ({
    displayName,
    keyStat: 'con',
    castType,
    contexts: [],
})

describe('act composes the turn from the ability sheet: [free, standard, swift]', () => {
    test('a standard ability replaces attacks until the priority list is exhausted, then attacks resume', () => {
        const data = createDefaultOwner({})
        addAbility(data.as, ignite)

        const turn1 = act(data)
        assert.equal(turn1.length, 1)
        assert.property(turn1[0], 'ability')

        // out of standard actions, default attack
        const turn2 = act(data)
        assert.equal(turn2.length, 1)
        assert.property(turn2[0], 'weapon')
    })

    test('swift abilities cycle through the priority list, wrapping at the end', () => {
        const data = createDefaultOwner({})
        addAbility(data.as, debuffAbility('Swift A', 'swift'))
        addAbility(data.as, debuffAbility('Swift B', 'swift'))

        const castNames = [act(data), act(data), act(data)].map(turn => {
            const last = turn[turn.length - 1]
            assert.property(last, 'ability')
            return (last as { ability: Ability }).ability.displayName
        })

        assert.deepEqual(castNames, ['Swift A', 'Swift B', 'Swift A'])
    })

    test('ex: one turn dual wielding', () => {
        const data = createDefaultOwner({
            es: {
                ...defaultEquipmentSheet,
                offhand: shortsword,
            }
        })
        addAbility(data.as, debuffAbility('Free Debuff', 'free'))
        addAbility(data.as, debuffAbility('Swift Debuff', 'swift'))

        const turn = act(data)

        // free ability, weapon attack, swift ability
        assert.equal(turn.length, 4)
        assert.property(turn[0], 'ability')
        assert.property(turn[1], 'weapon')
        assert.property(turn[2], 'weapon')
        assert.property(turn[3], 'ability')
        assert.equal((turn[0] as { ability: Ability }).ability.displayName, 'Free Debuff')
        assert.equal((turn[3] as { ability: Ability }).ability.displayName, 'Swift Debuff')
    })
})
