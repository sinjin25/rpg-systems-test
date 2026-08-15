import { StatusEffect } from '..'
import { createDefaultOwner } from '../../actor2'
import { decayEnemyKilled } from './decay-enemy-killed'
import { describe, test, assert } from 'vitest'

describe('decayEnemyKilled', () => {
    const goblin = () => ({ health: { curr: 0 } })

    const killedBuff = (enemy: { health: { curr: number } }): StatusEffect => ({
        displayName: 'killedBuff',
        broadContexts: {},
        expiration: { kind: 'enemy-killed', enemy },
    })

    test('removes the status whose enemy matches the killed target', () => {
        const enemy = goblin()
        const owner = createDefaultOwner({
            ss: {
                test: killedBuff(enemy)
            }
        })

        decayEnemyKilled([owner], enemy)
        assert.notExists(owner.ss.test)
    })

    test('keeps the status when a different enemy is killed', () => {
        const enemy = goblin()
        const owner = createDefaultOwner({
            ss: {
                test: killedBuff(enemy)
            }
        })

        // structurally identical, but a different object: the check is by reference
        decayEnemyKilled([owner], goblin())
        assert.exists(owner.ss.test)
    })

    test('removes matching statuses across every owner passed in', () => {
        const enemy = goblin()
        const a = createDefaultOwner({ ss: { test: killedBuff(enemy) } })
        const b = createDefaultOwner({ ss: { test: killedBuff(enemy) } })

        decayEnemyKilled([a, b], enemy)
        assert.notExists(a.ss.test)
        assert.notExists(b.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const enemy = goblin()
        const owner = createDefaultOwner({
            ss: {
                test: {
                    displayName: 'roundsBuff',
                    broadContexts: {},
                    expiration: { kind: 'rounds-elapsed', remaining: 3 },
                }
            }
        })

        decayEnemyKilled([owner], enemy)
        assert.exists(owner.ss.test)
    })

    test('runs onExpiration when the enemy dies', () => {
        const enemy = goblin()
        const followUp: StatusEffect = {
            displayName: 'follow up',
            broadContexts: {},
        }
        const owner = createDefaultOwner({
            ss: {
                test: { ...killedBuff(enemy), onExpiration: () => followUp }
            }
        })

        decayEnemyKilled([owner], enemy)
        assert.notExists(owner.ss.test)
        assert.equal(owner.ss['follow up'], followUp)
    })
})
