import { describe, test, expect, assert } from 'vitest'
import { createDefaultOwner, instantiateActor, Actor2, OwnerMaximal } from '..'
import { leaf, ModNode } from '../../log2'
import modNodeToText from '../../log2/format'
import { BaseEquipment } from '../../equipment-sheet2/types'
import { iterate } from '../../simulate/util/iterate'
import {
    calculateAttack,
    calculateCritConfirm,
    calculateSAR,
    critDidConfirm,
    FinalStandardActionResult,
    hitDidConfirm,
    outputFinalSar,
    outputRawSar,
    sarAgainstTarget,
} from './attack'

// --- fixtures -------------------------------------------------------------

// a weapon with fixed damage so only the d20s vary between seeds
const testWeapon = (displayName: string): BaseEquipment => ({
    displayName,
    tags: ['melee'],
    broadContexts: {
        'damage': () => leaf(displayName, 4),
        'crit-multiplier': () => leaf(displayName, 2),
    },
})

const testOwner = (es: OwnerMaximal['es'] = { mainhand: testWeapon('mainhand-weapon') }) =>
    createDefaultOwner({ cs: { str: 10, dex: 10 }, es })

const testActor = (es?: OwnerMaximal['es']): Actor2 => instantiateActor(testOwner(es))

// --- seed fishing ---------------------------------------------------------

// Re-runs `build` under seeds 0..iterations-1 and returns the first result satisfying `pred`.
// Nothing about the seed is hardcoded, so changing the PRNG - or changing how many dice a
// tree consumes - just moves which seed answers, and the test still passes.
const findRun = <T>(
    build: (seed: number) => T,
    pred: (result: T) => boolean,
    iterations = 400,
): T => {
    const hit = iterate(iterations, build).find(pred)
    if (!hit) throw Error(`No seed in [0, ${iterations}) produced a matching run`)
    return hit
}

const rollOf = (node: ModNode) => {
    const rollChild = node.children.find(c => c.displayName === 'roll')
    if (!rollChild) throw Error(`no roll child on:\n${modNodeToText(node)}`)
    return rollChild.total()
}

// a roll that triggers neither the nat-20 nor the nat-1 branch, so the AC comparison decides
const isOrdinaryRoll = (node: ModNode) => {
    const r = rollOf(node)
    return r > 1 && r < 20
}

const ac = (amount: number) => leaf('test-ac', amount)

// --- shape classification -------------------------------------------------

// sarAgainstTarget signals the outcome by which keys it returns
const shapeOf = (result: FinalStandardActionResult) => {
    if (!result.damageResult && !result.critDamageResult) return 'no-hit'
    if (result.damageResult && !result.critConfirmResult) return 'hit'
    if (result.damageResult && result.critConfirmResult) return 'threat-no-confirm'
    return 'confirmed-crit'
}

const keysOf = (result: FinalStandardActionResult) => Object.keys(result).sort()

// builds a whole SAR against a fresh owner, then resolves it against `targetAc`
const resolveAgainst = (targetAc: number) => (): FinalStandardActionResult => {
    const owner = testOwner()
    const sar = calculateSAR({ owner, relevantSlot: owner.es.mainhand! })
    return sarAgainstTarget(sar, ac(targetAc))
}

// A miss is common at this AC and only a natural 20 gets through, so it is the AC that
// isolates the threat branches.
const UNREACHABLE_AC = 30
// Low enough that any non-natural-1 roll lands, so threat depends only on the die.
const TRIVIAL_AC = 2

describe('calculateAttack', () => {
    test('sums the attack terminal and a d20 roll', () => {
        const owner = testOwner()
        const node = calculateAttack(owner, { relevantSlot: owner.es.mainhand! })

        assert.equal(node.children.length, 2)
        const [attackChild, rollChild] = node.children
        assert.equal(attackChild.displayName, 'attack')
        assert.equal(rollChild.displayName, 'roll')
        assert.equal(node.total(), attackChild.total() + rollChild.total())
    })

    test('exposes the raw roll as a direct child named "roll"', () => {
        const rolls = iterate(200, () => {
            const owner = testOwner()
            return rollOf(calculateAttack(owner, { relevantSlot: owner.es.mainhand! }))
        })

        assert.isTrue(rolls.every(r => Number.isInteger(r) && r >= 1 && r <= 20))
        // the whole face range is reachable - the child really is the d20, not a constant
        assert.include(rolls, 1)
        assert.include(rolls, 20)
    })
})

describe('calculateCritConfirm', () => {
    test('sums the crit-confirm terminal and a d20 roll', () => {
        const owner = testOwner()
        const node = calculateCritConfirm(owner, { relevantSlot: owner.es.mainhand! })

        assert.equal(node.children.length, 2)
        const [confirmChild, rollChild] = node.children
        assert.equal(confirmChild.displayName, 'crit-confirm')
        assert.equal(rollChild.displayName, 'roll')
        assert.equal(node.total(), confirmChild.total() + rollChild.total())
    })

    test('exposes the raw roll as a direct child named "roll"', () => {
        const rolls = iterate(200, () => {
            const owner = testOwner()
            return rollOf(calculateCritConfirm(owner, { relevantSlot: owner.es.mainhand! }))
        })

        assert.isTrue(rolls.every(r => Number.isInteger(r) && r >= 1 && r <= 20))
        assert.include(rolls, 1)
        assert.include(rolls, 20)
    })
})

describe('attack hit resolution', () => {
    const anAttack = () => {
        const owner = testOwner()
        return calculateAttack(owner, { relevantSlot: owner.es.mainhand! })
    }

    test('hits when the attack total meets the target AC', () => {
        const attack = findRun(anAttack, isOrdinaryRoll)
        assert.isTrue(hitDidConfirm(attack, ac(attack.total())))
    })

    test('misses when the attack total is below the target AC', () => {
        const attack = findRun(anAttack, isOrdinaryRoll)
        assert.isFalse(hitDidConfirm(attack, ac(attack.total() + 1)))
    })

    test('a natural 20 hits an AC the total cannot reach', () => {
        const attack = findRun(anAttack, node => rollOf(node) === 20)
        assert.isTrue(hitDidConfirm(attack, ac(attack.total() + 1)))
    })

    test('a natural 1 misses an AC the total clears', () => {
        const attack = findRun(anAttack, node => rollOf(node) === 1)
        assert.isFalse(hitDidConfirm(attack, ac(attack.total())))
    })

    // this is an acceptable bug at the moment
    test.skip('a natural max face on a widened die counts as a natural 20')

    // this is an acceptable bug
    test.skip('a roll of 20 on a widened die is not a natural 20')
})

describe('crit confirmation', () => {
    const aConfirm = () => {
        const owner = testOwner()
        return calculateCritConfirm(owner, { relevantSlot: owner.es.mainhand! })
    }

    test('confirms when the confirm total meets the target AC', () => {
        const confirm = findRun(aConfirm, isOrdinaryRoll)
        assert.isTrue(critDidConfirm(confirm, ac(confirm.total())))
    })

    test('does not confirm when the confirm total is below the target AC', () => {
        const confirm = findRun(aConfirm, isOrdinaryRoll)
        assert.isFalse(critDidConfirm(confirm, ac(confirm.total() + 1)))
    })

    test('a natural 20 on the confirm roll always confirms', () => {
        const confirm = findRun(aConfirm, node => rollOf(node) === 20)
        assert.isTrue(critDidConfirm(confirm, ac(confirm.total() + 1)))
    })

    test('a natural 1 on the confirm roll never confirms', () => {
        const confirm = findRun(aConfirm, node => rollOf(node) === 1)
        assert.isFalse(critDidConfirm(confirm, ac(confirm.total())))
    })
})

describe('sarAgainstTarget', () => {
    describe('confirm returned keys', () => {
        test('case 1: no hit', () => {
            const result = findRun(
                resolveAgainst(UNREACHABLE_AC),
                r => shapeOf(r) === 'no-hit',
            )

            assert.deepEqual(keysOf(result), ['acResult', 'attackResult', 'relevantSlot'])
        })

        test('case 2: hit but no threat', () => {
            const result = findRun(
                resolveAgainst(TRIVIAL_AC),
                r => shapeOf(r) === 'hit',
            )

            assert.deepEqual(keysOf(result), [
                'acResult', 'attackResult', 'damageResult', 'relevantSlot', 'threatResult',
            ])
        })

        test('case 3: hit, threat, no confirm', () => {
            const result = findRun(
                resolveAgainst(UNREACHABLE_AC),
                r => shapeOf(r) === 'threat-no-confirm',
            )

            assert.deepEqual(keysOf(result), [
                'acResult', 'attackResult', 'critConfirmResult', 'damageResult',
                'relevantSlot', 'threatResult',
            ])
        })

        test('case 4: hit, threat, confirm', () => {
            const result = findRun(
                resolveAgainst(TRIVIAL_AC),
                r => shapeOf(r) === 'confirmed-crit',
            )

            assert.deepEqual(keysOf(result), [
                'acResult', 'attackResult', 'critConfirmResult', 'critDamageResult',
                'relevantSlot', 'threatResult',
            ])
        })
    })
})

describe('outputRawSar', () => {
    // use equipment-sheet2 for types
    test('a two-handed weapon produces one SAR against the twohanded slot', () => {
        const twohanded = testWeapon('greatsword')
        const actor = testActor({ twohanded })

        const sar = outputRawSar(actor)

        assert.equal(sar.length, 1)
        assert.equal(sar[0].relevantSlot, twohanded)
    })

    test('twohanded takes priority over an occupied mainhand', () => {
        const twohanded = testWeapon('greatsword')
        const actor = testActor({ mainhand: testWeapon('mainhand-weapon'), twohanded })

        const sar = outputRawSar(actor)

        assert.equal(sar.length, 1)
        assert.equal(sar[0].relevantSlot, twohanded)
    })

    test('an offhand that can deal damage produces two SARs', () => {
        const mainhand = testWeapon('mainhand-weapon')
        const offhand = testWeapon('offhand-weapon')
        const actor = testActor({ mainhand, offhand })

        const sar = outputRawSar(actor)

        assert.equal(sar.length, 2)
        assert.equal(sar[0].relevantSlot, mainhand)
        assert.equal(sar[1].relevantSlot, offhand)
    })

    test('an offhand with no damage context produces one mainhand SAR', () => {
        const mainhand = testWeapon('mainhand-weapon')
        // a shield: occupies the slot but contributes no damage
        const offhand: BaseEquipment = {
            displayName: 'buckler',
            tags: ['shield'],
            broadContexts: { 'ac-of-equipment': () => leaf('buckler', 1) },
        }
        const actor = testActor({ mainhand, offhand })

        const sar = outputRawSar(actor)

        assert.equal(sar.length, 1)
        assert.equal(sar[0].relevantSlot, mainhand)
    })

    // this will never happen and also would break
    test.skip('falls back to mainhand when no other slot qualifies')
})

describe('outputFinalSar', () => {
    const dualWieldRun = () => {
        const mainhand = testWeapon('mainhand-weapon')
        const offhand = testWeapon('offhand-weapon')
        const attacker = testActor({ mainhand, offhand })
        const target = testActor()

        return {
            mainhand,
            offhand,
            final: outputFinalSar(outputRawSar(attacker), target),
        }
    }

    test('Confirm different SAR have different shapes', () => {
        const { final } = findRun(
            dualWieldRun,
            run => shapeOf(run.final[0]) !== shapeOf(run.final[1]),
        )

        assert.equal(final.length, 2)
        assert.notDeepEqual(keysOf(final[0]), keysOf(final[1]))
    })

    test('preserves the relevantSlot of each SAR through resolution', () => {
        const { mainhand, offhand, final } = dualWieldRun()

        assert.equal(final.length, 2)
        assert.equal(final[0].relevantSlot, mainhand)
        assert.equal(final[1].relevantSlot, offhand)
    })
})
