import { createDefaultOwner, instantiateActor } from '../actor2'
import filterByTeam from './filter-by-team'
import { describe, test, assert, expect } from 'vitest'

describe('filter-by-team', () => {
    const player = instantiateActor(createDefaultOwner(), true)
    const enemy = instantiateActor(createDefaultOwner())
    const participants = { playerTeam: [player], enemyTeam: [enemy] }

    test('defaults to the enemy team', () => {
        assert.deepEqual(filterByTeam(participants), [enemy])
    })

    test('"player" returns the player team', () => {
        assert.deepEqual(filterByTeam(participants, 'player'), [player])
    })

    test('"enemy" returns the enemy team', () => {
        assert.deepEqual(filterByTeam(participants, 'enemy'), [enemy])
    })

    test('"any" returns both teams combined', () => {
        assert.deepEqual(filterByTeam(participants, 'any'), [player, enemy])
    })
})
