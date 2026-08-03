import { Actor2, createDefaultOwner, instantiateActor, OwnerMaximal } from '../actor2/index.ts'
import modNodeToText from '../log2/format.ts'
import newModNode, { findNodeMatching, leaf, ModNode, sumFunc } from '../log2/index.ts'
import damageOverTimeTaken from '../log2/terminal-composition/damage-over-time-taken.ts'
import damageOverTime from '../log2/terminal/damage-over-time.ts'
import { StatusEffect } from './index.ts'
import { applyTicks, calculateTick } from './tick.ts'
import { describe, test, assert, expect } from 'vitest'
import { SnapshotStatusEffect } from './types.ts'
import applyDamage from '../health/apply-damage.ts'

const st: SnapshotStatusEffect = (data) => {
    return {
        displayName: 'dot',
        broadContexts: {},
        expiration: {
            kind: 'rounds-elapsed',
            remaining: 3,
        },
        tick: {
            calculateDamage(target: OwnerMaximal) {
                const n = leaf('dot', 4)
                const node = damageOverTime(n)(data.snapshot)
                return damageOverTimeTaken({
                    node,
                })(target)
            },
        }
    }
}

describe('triggerDamage', () => {
    test('triggerDamage can be calculated and applied', () => {
        const caster = createDefaultOwner({
            fs: {
                'dot-plus': {
                    displayName: 'dot-plus',
                    broadContexts: {
                        'damage-over-time-feat-mod': () => leaf('dot-plus', 2)
                    }
                }
            }
        })

        const receiver = createDefaultOwner({
            fs: {
                'dot-defense': {
                    displayName: 'dot-defense',
                    broadContexts: {
                        'damage-over-time-taken-feat-mod': () => leaf('dot-defense', -2)
                    }
                }
            },
            // this doesn't matter when ran directly
            ss: {
                ignite: st({
                    snapshot: caster,
                })
            }
        })

        const ct = calculateTick(
            receiver.ss.ignite,
            receiver,
        )

        console.log(ct)
        console.log(modNodeToText(ct.calculateDamage!))

        const f0 = findNodeMatching(ct.calculateDamage!, /damage-over-time-taken/, {
            includeRoot: true
        })

        assert.exists(f0)
        assert.equal(f0.total(), 4) // +4 reduced by -2

        const actor = instantiateActor(receiver)
        applyDamage(actor.health, ct.calculateDamage!.total())
        assert.equal(
            actor.health.curr + ct.calculateDamage!.total(),
            actor.health.max)
    })
})