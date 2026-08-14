import { createDefaultOwner, instantiateActor } from '../actor2'
import findTargets from './index'
import { TargetPriority } from './types'
import { describe, test, assert, expect } from 'vitest'

describe('target/index', () => {
    test('picks the first living, targetable enemy', () => {
        const enemy = instantiateActor(createDefaultOwner())
        const ally = instantiateActor(createDefaultOwner(), true)
        const tp: TargetPriority = { simple: 'first', team: 'enemy', filters: [] }

        assert.deepEqual(findTargets([enemy], [ally], tp), [enemy])
    })

    test('skips dead enemies', () => {
        const deadEnemy = instantiateActor(createDefaultOwner())
        deadEnemy.health.curr = 0
        const liveEnemy = instantiateActor(createDefaultOwner())
        const ally = instantiateActor(createDefaultOwner(), true)
        const tp: TargetPriority = { simple: 'first', team: 'enemy', filters: [] }

        assert.deepEqual(findTargets([deadEnemy, liveEnemy], [ally], tp), [liveEnemy])
    })

    test('test simple override', () => {
        const enemy = instantiateActor(createDefaultOwner())
        const enemy2 = instantiateActor(createDefaultOwner())
        const ally = instantiateActor(createDefaultOwner(), true)

        // target first two enemies
        const tp: TargetPriority = {
            simple: 'first', team: 'enemy', filters: [], override: (fp, ft, vt) => {
                return [ft[0], ft[1]].filter(a => !!a)
            }
        }

        assert.deepEqual(findTargets([enemy, enemy2], [ally], tp), [enemy, enemy2])
    })
})
