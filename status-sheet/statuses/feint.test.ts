import { describe, test, assert } from 'vitest'
import { createDefaultOwner } from '../../defaults/index.ts'
import { act } from '../../character/act/index.ts'
import { instantiateHealth, instantiateSpeed } from '../../character/actor/index.ts'
import ModifierLog from '../../stat-modifier/log/index.ts'
import { feintStatus } from './feint.ts'
import { featMeasuredStrike } from '../../feat/feats/measured-strike.ts'
import { collectIntercepts, applyIntercepts } from '../../roll-intercept/index.ts'

const buildActor = (owner: ReturnType<typeof createDefaultOwner>) => ({
    owner,
    health: instantiateHealth(owner),
    speed: instantiateSpeed(owner),
})

// the attacker's own act() output, but with the attack roll forced to a specific
// natural result so hit/miss is deterministic for the test
const forceNaturalRoll = (sar: ReturnType<typeof act>[number], naturalRoll: number) => {
    const attackLog = ModifierLog(sar.attackLog.displayName)
    sar.attackLog.groups.forEach(g => attackLog.addModGroup(g.displayName, g))
    attackLog.addRoll({ displayName: 'd20', amount: naturalRoll })
    return { ...sar, attackLog, attackRoll: attackLog.finalResult().total }
}

describe('feintStatus', () => {
    test('on a natural 1, upgrades the roll to a natural 20 and consumes itself', () => {
        const attackerOwner = createDefaultOwner({ ss: { featFeint: feintStatus('featFeint') } })
        const targetOwner = createDefaultOwner({})
        const attacker = buildActor(attackerOwner)
        const target = buildActor(targetOwner)

        const [sar] = act({ cs: attackerOwner.cs, es: attackerOwner.es, fs: attackerOwner.fs, ss: attackerOwner.ss })
        const missSar = forceNaturalRoll(sar, 1)

        const modifier = missSar.attackLog.finalResult().modifier
        const result = attackerOwner.ss.featFeint.interceptRoll!(attacker, target, missSar)

        assert.notStrictEqual(result, missSar)
        assert.equal(result.attackLog.finalResult().roll, 20)
        assert.equal(result.attackRoll, 20 + modifier)
        assert.notProperty(attackerOwner.ss, 'featFeint')
    })

    test('does not touch the roll (or consume itself) on anything but a natural 1', () => {
        const attackerOwner = createDefaultOwner({ ss: { featFeint: feintStatus('featFeint') } })
        const targetOwner = createDefaultOwner({})
        const attacker = buildActor(attackerOwner)
        const target = buildActor(targetOwner)

        const [sar] = act({ cs: attackerOwner.cs, es: attackerOwner.es, fs: attackerOwner.fs, ss: attackerOwner.ss })
        const hitSar = forceNaturalRoll(sar, 15)

        const result = attackerOwner.ss.featFeint.interceptRoll!(attacker, target, hitSar)

        assert.strictEqual(result, hitSar)
        assert.property(attackerOwner.ss, 'featFeint')
    })

    test('resolves before Measured Strike: a natural 1 becomes a natural 20, and the reroll-average never fires', () => {
        const attackerOwner = createDefaultOwner({
            fs: { featMeasuredStrike },
            ss: { featFeint: feintStatus('featFeint') },
        })
        const targetOwner = createDefaultOwner({})
        const attacker = buildActor(attackerOwner)
        const target = buildActor(targetOwner)

        const [sar] = act({ cs: attackerOwner.cs, es: attackerOwner.es, fs: attackerOwner.fs, ss: attackerOwner.ss })
        const missSar = forceNaturalRoll(sar, 1)

        const intercepts = collectIntercepts(attackerOwner)
        const result = applyIntercepts(attacker, target, missSar, intercepts)

        assert.equal(result.attackLog.finalResult().roll, 20)
        assert.isUndefined(result.attackLog.roll.find(r => r.displayName.includes('measured strike')))
        assert.notProperty(attackerOwner.ss, 'featFeint')
    })
})
