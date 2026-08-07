import { describe, test, expect } from 'vitest'
import {
    getCharacterLevel,
    sumAttackBonusFromClassLevels,
    sumFortitudeSaveFromClassLevels,
    sumReflexSaveFromClassLevels,
} from '../derive/index'
import { commitLevelUp } from '../../../character/level-up'
import { createDefaultOwner } from '../../../actor2'
import { armors, heavyShield, longsword } from '../../../equipment-sheet2/defaults'
import { findNodeMatching, ModNode } from '../../../log2'
import { ac, attack, damage, maximumHealth, save } from '../../../log2/terminal'

// a common level-4 fighter: str 16 / dex 14 / con 15, longsword + heavy shield + banded mail.
// four fighter levels grant Improved Initiative (L1), Hardy (L2), Power Attack + Armor
// Training (L3), plus the selected bonus feats Rage (L1) and Battle Focus (L3).
// both bonus picks are onFightStart feats, so they contribute nothing to the static trees
// below - this benchmark measures the class chassis plus Power Attack and Hardy.
const buildLevel4Fighter = () => {
    const fighter = createDefaultOwner({
        cs: { str: 16, dex: 14, levels: {} },
        es: {
            mainhand: longsword,
            offhand: heavyShield,
            armor: armors['banded mail'],
        },
    })
    const levelUps = [
        commitLevelUp(fighter, { className: 'fighter', bonusFeat: 'Rage' }),          // L1
        commitLevelUp(fighter, { className: 'fighter' }),                             // L2
        commitLevelUp(fighter, { className: 'fighter', bonusFeat: 'Battle Focus' }),  // L3
        commitLevelUp(fighter, { className: 'fighter' }),                             // L4
    ]
    // fail loudly here rather than silently benchmarking a level-0 fighter
    levelUps.forEach((result, i) => {
        if (!result.ok) throw new Error(`benchmark: level ${i + 1} failed: ${result.reason}`)
    })
    return fighter
}

// the tests below only read the fighter, so one shared instance is fine
const fighter = buildLevel4Fighter()

// anchored on purpose: node names nest as substrings ('damage-feat-mod' is inside
// 'crit-scalable-damage-feat-mod'), and findNodeMatching is depth-first, so an
// unanchored pattern happily returns the wrong node.
const exactly = (name: string) => new RegExp(`^${name}$`)

const nodeTotal = (node: ModNode, name: string): number => {
    const found = findNodeMatching(node, exactly(name))
    if (!found) throw new Error(`benchmark: no "${name}" node found`)
    return found.total()
}

describe('Level 4 fighter benchmark', () => {
    test('is character level 4', () => {
        expect(getCharacterLevel(fighter.cs)).toEqual(4)
    })

    test('attack modifier: str +3, BAB +4 and Power Attack +2', () => {
        // the d20 is added at roll time (see actor2/act/attack.ts); this is just the flat part.
        // Rage is a fight-start status feat with no attack broadcontext, so it never applies here.
        fighter.relevantSlot = longsword
        const node = attack(fighter)

        expect(nodeTotal(node, 'effective-attack-stat')).toEqual(3)  // str 16 -> +3, longsword isn't finesse
        expect(nodeTotal(node, 'base-attack-bonus')).toEqual(4)      // +1 per fighter level x4
        expect(nodeTotal(node, 'attack-feat-mod')).toEqual(2)        // Power Attack
        expect(nodeTotal(node, 'attack-status-mod')).toEqual(0)
        expect(nodeTotal(node, 'attack-from-equipment')).toEqual(0)  // plain longsword

        // the 'base-attack-bonus' child is exactly the class-level attack bonus summer
        expect(sumAttackBonusFromClassLevels(fighter.cs.levels)).toEqual(4)

        expect(node.total()).toEqual(9) // 3 + 4 + 2
    })

    test('ac: 10 base + 2 dex + 9 armor', () => {
        const node = ac(fighter)

        expect(nodeTotal(node, 'base-ac')).toEqual(10)
        // dex 14 -> +2. banded mail's base max dex is +1, but Armor Training (L3) raises
        // the cap by +1 via 'max-dex-feat-mod', so the full +2 gets through.
        expect(nodeTotal(node, 'ac-from-dex')).toEqual(2)
        expect(nodeTotal(node, 'max-dex-of-equipment')).toEqual(2)
        // banded mail (7) + heavy shield (2): both flat-ac pieces count
        expect(nodeTotal(node, 'ac-of-equipment')).toEqual(9)
        expect(nodeTotal(node, 'ac-feat-mod')).toEqual(0) // no ac-granting feat in the fighter table
        expect(nodeTotal(node, 'ac-status-mod')).toEqual(0)

        expect(node.total()).toEqual(21)
    })

    test('damage modifier: str +3 and Power Attack +2 (plus 1d8 weapon)', () => {
        fighter.relevantSlot = longsword
        const node = damage(fighter)

        expect(nodeTotal(node, 'effective-damage-stat')).toEqual(3)  // str 16 -> +3
        expect(nodeTotal(node, 'damage-feat-mod')).toEqual(2)        // Power Attack, granted at fighter 3
        expect(nodeTotal(node, 'flat-damage')).toEqual(0)            // nothing emits flat-damage-feat-mod here

        // the longsword rolls 1d8 on top of the flat +5, and log2 totals are lazy,
        // so pin the range rather than an exact number
        expect(node.total()).toBeGreaterThanOrEqual(6)  // 1 + 5
        expect(node.total()).toBeLessThanOrEqual(13)    // 8 + 5
    })

    test('health: 20 base + (10 + con 2) x 4 levels', () => {
        const node = maximumHealth(fighter)

        expect(nodeTotal(node, 'base-health')).toEqual(20)
        // the per-level node folds the con mod in (con 15 -> +2) and multiplies by level
        expect(nodeTotal(node, 'health-from-levels')).toEqual(48) // (10 + 2) * 4
        expect(nodeTotal(node, 'flat-health')).toEqual(0)

        expect(node.total()).toEqual(68)
    })

    test('saves: fortitude (class + con + Hardy), reflex (dex)', () => {
        const fort = save('fortitude')(fighter)
        const reflex = save('reflex')(fighter)

        // unlike the old save factory, log2's save tree folds the class-level base save in
        // itself - sumFortitudeSaveFromClassLevels is a cross-check on that child, not an addend.
        expect(nodeTotal(fort, 'base-fortitude')).toEqual(2) // 1+0+1+0 across the four levels
        expect(sumFortitudeSaveFromClassLevels(fighter.cs.levels)).toEqual(2)
        expect(nodeTotal(fort, 'modded-con')).toEqual(2)     // con 15 -> +2
        expect(nodeTotal(fort, 'fortitude-feat-mod')).toEqual(2) // Hardy
        expect(fort.total()).toEqual(6)

        // save() drops zero-total children, and a pure fighter has no class reflex bonus,
        // so 'base-reflex' is absent from the tree entirely
        expect(findNodeMatching(reflex, exactly('base-reflex'))).toBeUndefined()
        expect(sumReflexSaveFromClassLevels(fighter.cs.levels)).toEqual(0)
        expect(nodeTotal(reflex, 'modded-dex')).toEqual(2)   // dex 14 -> +2
        expect(reflex.total()).toEqual(2)
    })
})
