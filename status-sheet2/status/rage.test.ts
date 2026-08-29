import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import featImprovedRage from '../../feat2/feats/improved-rage'
import { addStatusToStatusSheet } from '..'
import { leaf, findNodeMatching } from '../../log2'
import { BaseEquipment } from '../../equipment-sheet2/types'
import { FeatSheet } from '../../feat2'
import attack from '../../log2/terminal/attack.ts'
import damage from '../../log2/terminal/damage.ts'
import critDamage from '../../log2/terminal/crit-damage.ts'
import rage, { RAGE_ATTACK_BONUS, RAGE_DAMAGE_BONUS } from './rage.ts'
import { describe, test, assert, expect } from 'vitest'
import { SLOT_TYPE } from '../../equipment-sheet2/defaults.ts'

const IMPROVED_RAGE_EXTRA = 2

// the default shortsword rolls, so crit totals need a weapon with fixed damage
const testWeapon: BaseEquipment = {
    displayName: 'test-weapon',
    acceptableSlots: SLOT_TYPE.weapon,
    tags: ['melee'],
    broadContexts: {
        damage: () => leaf('test-weapon', 4),
        'crit-multiplier': () => leaf('test-weapon', 2),
    },
}

const makeOwner = (data: { improved?: boolean, raging?: boolean, weapon?: BaseEquipment } = {}) => {
    const fs: FeatSheet = data.improved ? { [featImprovedRage.displayName]: featImprovedRage } : {}
    const owner = createDefaultOwner({
        cs: { str: 10, dex: 10 },
        fs,
        es: data.weapon ? { mainhand: data.weapon } : undefined,
    })
    if (data.raging !== false) addStatusToStatusSheet(owner, owner, rage)
    return owner
}

const rageNodeTotal = (node: ReturnType<typeof attack>) => {
    const f0 = findNodeMatching(node, /rage/i)
    assert.exists(f0)
    return f0.total()
}

describe('Rage', () => {
    test('applies its attack bonus', () => {
        assert.equal(rageNodeTotal(attack(makeOwner())), RAGE_ATTACK_BONUS)
    })

    test('Improved Rage raises the attack bonus', () => {
        const base = rageNodeTotal(attack(makeOwner()))
        const improved = rageNodeTotal(attack(makeOwner({ improved: true })))

        assert.equal(improved, RAGE_ATTACK_BONUS + IMPROVED_RAGE_EXTRA)
        assert.isAbove(improved, base)
    })

    test('applies its damage bonus', () => {
        assert.equal(rageNodeTotal(damage(makeOwner())), RAGE_DAMAGE_BONUS)
    })

    test('Improved Rage raises the damage bonus', () => {
        const base = rageNodeTotal(damage(makeOwner()))
        const improved = rageNodeTotal(damage(makeOwner({ improved: true })))

        assert.equal(improved, RAGE_DAMAGE_BONUS + IMPROVED_RAGE_EXTRA)
        assert.isAbove(improved, base)
    })

    test('the damage bonus is scaled by a crit', () => {
        const CRIT = 2
        const noRage = critDamage(makeOwner({ raging: false, weapon: testWeapon }))
        const raging = critDamage(makeOwner({ weapon: testWeapon }))
        const improved = critDamage(makeOwner({ improved: true, weapon: testWeapon }))

        assert.equal(noRage.total(), 4 * CRIT)
        assert.equal(raging.total(), (4 + RAGE_DAMAGE_BONUS) * CRIT)
        assert.equal(improved.total(), (4 + RAGE_DAMAGE_BONUS + IMPROVED_RAGE_EXTRA) * CRIT)

        // the bonus rides under crit-scalable-damage, so the crit multiplies it
        assert.equal(raging.total() - noRage.total(), RAGE_DAMAGE_BONUS * CRIT)
        assert.equal(improved.total() - noRage.total(), (RAGE_DAMAGE_BONUS + IMPROVED_RAGE_EXTRA) * CRIT)
        assert.exists(findNodeMatching(raging, /crit-scalable-damage/))
    })
})
