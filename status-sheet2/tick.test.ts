import { Actor2, createDefaultOwner, instantiateActor, OwnerMaximal } from '../actor2/index.ts'
import modNodeToText from '../log2/format.ts'
import newModNode, { findNodeMatching, leaf, ModNode, sumFunc } from '../log2/index.ts'
import damageOverTimeTaken from '../log2/terminal-composition/damage-over-time-taken.ts'
import damageOverTime from '../log2/terminal/damage-over-time.ts'
import { addStatusToStatusSheet, ignite, StatusEffect } from './index.ts'
import { calculateDamageTicks, calculateTick } from './tick.ts'
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

const nonSnapshotSt: StatusEffect = {
    displayName: 'normal dot',
    broadContexts: {},
    tick: {
        calculateDamage(target: OwnerMaximal) {
            return damageOverTimeTaken({
                node: leaf('stable dot', 3)
            })(target)
        }
    }
}

const mightGoNeg: StatusEffect = {
    displayName: 'normal dot',
    broadContexts: {},
    tick: {
        calculateDamage(target: OwnerMaximal) {
            return damageOverTimeTaken({
                node: leaf('might-go-neg', 1)
            })(target)
        }
    }
}

describe('damage works', () => {
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
            }),
            nonSnapshotSt,
            mightGoNeg,
        }
    })
    test('calculateDamage works in insolation', () => {

        const ct = calculateTick(
            receiver.ss.ignite,
            receiver,
        )

        /* console.log(ct) */
        /* console.log(modNodeToText(ct.calculateDamage!)) */

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

        // returns the statuseffect
        assert.exists(ct.source)
    })
    test('calculateDamageTicks works', () => {
        const ct = calculateTick(
            receiver.ss.ignite,
            receiver,
        )

        const actor = instantiateActor(receiver)
        const result = calculateDamageTicks(actor)

        // 3 items here
        assert.equal(result.length, 3)
        /* console.log(result) */

        // apply all the ticks manually
        result.forEach(a => applyDamage(actor.health, a.node.total()))

        // ensure we actually have multiple items with values
        const sum = result.map(a => a.node.total()).reduce((acc, a) => acc + a, 0)

        assert.equal(
            sum > result[0].node.total(),
            true
        )
        // all three are applied
        assert.equal(
            actor.health.curr,
            actor.health.max -= sum,
        )

        result.forEach(a => {
            // make sure damage ticks cant go negative
            assert.equal(
                a.node.total() >= 0,
                true
            )
        })
    })
})

describe('calculateDamageTicks', () => {
    test('Returns all damage-over-time-taken calculations for each', () => {
        const owner = createDefaultOwner()
        addStatusToStatusSheet(owner, ignite)
        // make another
        owner.ss['ign'] = ignite({
            snapshot: owner
        })
        const actor = instantiateActor(owner)
        const cdt = calculateDamageTicks(actor)
        assert.equal(cdt.length, 2)
    })
})