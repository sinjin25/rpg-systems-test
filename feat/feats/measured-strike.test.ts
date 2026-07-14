import { describe, test, assert } from 'vitest'
import { createDefaultOwner } from '../../defaults/index.ts'
import { act } from '../../character/act/index.ts'
import { instantiateHealth, instantiateSpeed } from '../../character/actor/index.ts'
import ModifierLog, { util_findModLogGroupItem } from '../../stat-modifier/log/index.ts'
import roll, { setSeed, clearSeed } from '../../roll/index.ts'
import { featMeasuredStrike } from './measured-strike.ts'

const VERBOSE = true

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

describe('featMeasuredStrike', () => {
    test('on a miss, replaces the roll with the average of the original roll and a reroll', () => {
        const NAT_ROLL = 1
        const attackerOwner = createDefaultOwner({ fs: { featMeasuredStrike } })
        const targetOwner = createDefaultOwner({})
        const attacker = buildActor(attackerOwner)
        const target = buildActor(targetOwner)

        const [sar] = act({ cs: attackerOwner.cs, es: attackerOwner.es, fs: attackerOwner.fs, ss: attackerOwner.ss })
        const missSar = forceNaturalRoll(sar, NAT_ROLL) // automatic miss

        setSeed(1234)
        // roll 2
        const result = featMeasuredStrike.interceptRoll!(attacker, target, missSar)
        clearSeed()

        setSeed(1234)
        // roll 2
        const reroll = roll(20)
        clearSeed()

        const expectedAverage = Math.floor((NAT_ROLL + reroll) / 2)
        const modifier = missSar.attackLog.finalResult().modifier
        assert.notStrictEqual(result, missSar)
        assert.notStrictEqual(result.attackLog, missSar.attackLog)
        assert.equal(result.attackLog.finalResult().roll, expectedAverage)
        assert.equal(result.attackRoll, expectedAverage + modifier)

        if (VERBOSE) console.table(result.attackLog.roll)
    })

    test('Confirm averaging behavior: Rounds down', () => {
        const NAT_ROLL = 6
        const attackerOwner = createDefaultOwner({ fs: { featMeasuredStrike } })
        const targetOwner = createDefaultOwner({})
        const attacker = buildActor(attackerOwner)
        const target = buildActor(targetOwner)

        const [sar] = act({ cs: attackerOwner.cs, es: attackerOwner.es, fs: attackerOwner.fs, ss: attackerOwner.ss })
        const missSar = forceNaturalRoll(sar, NAT_ROLL) // automatic miss

        setSeed(1234)
        // this is a 2
        const result = featMeasuredStrike.interceptRoll!(attacker, target, missSar)
        clearSeed()

        setSeed(1234)
        // this is also a 2
        const reroll = roll(20)
        console.log('reroll', reroll)
        clearSeed()

        const expectedAverage = Math.floor((NAT_ROLL + reroll) / 2)
        const modifier = missSar.attackLog.finalResult().modifier
        assert.notStrictEqual(result, missSar)
        assert.notStrictEqual(result.attackLog, missSar.attackLog)
        assert.equal(result.attackLog.finalResult().roll, expectedAverage)
        assert.equal(result.attackRoll, expectedAverage + modifier)

        if (VERBOSE) console.table(result.attackLog.roll)
    })

    test('does not touch the roll if the attack already hits', () => {
        const attackerOwner = createDefaultOwner({ fs: { featMeasuredStrike } })
        const targetOwner = createDefaultOwner({})
        const attacker = buildActor(attackerOwner)
        const target = buildActor(targetOwner)

        const [sar] = act({ cs: attackerOwner.cs, es: attackerOwner.es, fs: attackerOwner.fs, ss: attackerOwner.ss })
        const hitSar = forceNaturalRoll(sar, 15)

        const result = featMeasuredStrike.interceptRoll!(attacker, target, hitSar)

        assert.strictEqual(result, hitSar)
    })
})
