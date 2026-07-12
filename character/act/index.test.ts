import { CharacterSheet, defaultCharacterSheet } from "../../character-sheet";
import { defaultFeatSheet, FeatSheet } from "../../feat";
import { describe, test, assert, expect } from 'vitest'
import { defaultEquipmentSheet, EquipmentSheet } from "../../equipment-sheet";
import { act } from "./index.ts";
import { featImprovedCritical, featMeleeWeaponFighting, featPowerAttack } from "../../feat/feats/index.ts";
import { critAmulet, daggerPlusOne, RingPlusOneFinesseAttack, shortsword, strDagger } from "../../defaults/equipment/index.ts";
import { util_findRollModifierGroupItem } from "../../roll-modifier/types.ts";
import { toPlainModLog, toPlainModLogs } from "../../stat-modifier/log/format.ts";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Visualize a act logs:', () => {
    test('create the file', () => {
        const result = act({
            cs: defaultCharacterSheet,
            es: { ...defaultEquipmentSheet, mainhand: shortsword },
            fs: { ...defaultFeatSheet, featMeleeWeaponFighting },
            ss: {},
        })

        const theAttack = result[0]
        const logs = [theAttack.attackLog, theAttack.confirmLog, theAttack.damageLog, theAttack.critRangeLog, theAttack.critMultiplierLog]

        const outputPath = join(__dirname, 'act-result.debug.json')
        writeFileSync(outputPath, JSON.stringify(toPlainModLogs(logs), null, 2))
        console.log(`wrote ${relative(process.cwd(), outputPath)}`)
    })
})

describe('act works with attacks', () => {
    test('Simplest standard attack', () => {
        const result = act({
            cs: defaultCharacterSheet,
            es: {
                ...defaultEquipmentSheet,
                mainhand: shortsword
            },
            fs: defaultFeatSheet,
            ss: {},
        })

        assert.equal(result.length, 1)
        // default dex is 15
        assert.equal(result[0].attackRoll <= 22, true)
        assert.equal(result[0].damageRoll >= 2, true)
    })
})

describe('simulation: act works with feats', () => {
    test('should be affected by: character, mods, feats, equipment', () => {
        // +3
        const cs: CharacterSheet = {
            ...defaultCharacterSheet,
            dex: 16,
        }
        // +1
        const fs: FeatSheet = {
            ...defaultFeatSheet,
            featMeleeWeaponFighting
        }
        // +2
        const es: EquipmentSheet = {
            ...defaultEquipmentSheet,
            mainhand: daggerPlusOne,
            ring: RingPlusOneFinesseAttack,
        }
        // comes out to +6
        const EXPECTED_BONUS = 6
        const ATTACK_DICE_SIDES = 20
        const canEndEarlyFailure = (result: number) => result < EXPECTED_BONUS
        const canEndEarlyPass = (result: number) => result === EXPECTED_BONUS + ATTACK_DICE_SIDES
        const hasEnoughUniqueOutcomes = (result: number) => result === ATTACK_DICE_SIDES


        let pass = false
        const outputs: Record<number, number> = {}
        let uniqueOutcomes = 0
        for (let i = 0; i < 10000; i++) {
            const result = act({
                cs,
                es,
                fs,
                ss: {},
            })
            assert.equal(result.length, 1)

            // record
            const attackRoll = result[0].attackRoll
            if (!outputs[attackRoll]) {
                outputs[attackRoll] = 1
                uniqueOutcomes++
            }
            else outputs[attackRoll]++

            if (canEndEarlyFailure(attackRoll)) throw Error(`Unexpectedly low number (did not sum up all bonuses): ${attackRoll}`)
            if (canEndEarlyPass(attackRoll) && hasEnoughUniqueOutcomes(uniqueOutcomes)) {
                pass = true
                break;
            }
        }
        /* console.log(outputs, 'unique outcomes', uniqueOutcomes) */
        assert.equal(pass, true)
    })

    test('damage roll should be affected by: character, mods, feats, equipment', () => {
        // +3 (dex mod)
        const cs: CharacterSheet = {
            ...defaultCharacterSheet,
            dex: 16,
        }
        // +1 (melee weapon fighting also grants a damage bonus)
        const fs: FeatSheet = {
            ...defaultFeatSheet,
            featMeleeWeaponFighting
        }
        // +2 (equipment mods: ring +1, dagger's +1 enhancement)
        const es: EquipmentSheet = {
            ...defaultEquipmentSheet,
            mainhand: daggerPlusOne,
            ring: RingPlusOneFinesseAttack,
        }
        // bm(3) + fm(1) + em(2) = 6
        const EXPECTED_BONUS = 6
        // daggerPlusOne rolls pure base dice; its +1 arrives via the equipment mod above
        const WEAPON_FLAT_BONUS = 0
        const DAMAGE_DICE_SIDES = 4
        const canEndEarlyFailure = (result: number) => result < EXPECTED_BONUS + WEAPON_FLAT_BONUS + 1
        const canEndEarlyPass = (result: number) => result === EXPECTED_BONUS + WEAPON_FLAT_BONUS + DAMAGE_DICE_SIDES
        const hasEnoughUniqueOutcomes = (result: number) => result === DAMAGE_DICE_SIDES

        let pass = false
        const outputs: Record<number, number> = {}
        let uniqueOutcomes = 0
        for (let i = 0; i < 10000; i++) {
            const result = act({
                cs,
                es,
                fs,
                ss: {},
            })
            assert.equal(result.length, 1)

            const damageRoll = result[0].damageRoll
            if (!outputs[damageRoll]) {
                outputs[damageRoll] = 1
                uniqueOutcomes++
            }
            else outputs[damageRoll]++

            if (canEndEarlyFailure(damageRoll)) throw Error(`Unexpectedly low number (did not sum up all bonuses): ${damageRoll}`)
            if (canEndEarlyPass(damageRoll) && hasEnoughUniqueOutcomes(uniqueOutcomes)) {
                pass = true
                break;
            }
        }
        assert.equal(pass, true)
    })

    test('equipment damage can touch the character sheet', () => {
        const cs: CharacterSheet = {
            ...defaultCharacterSheet,
            dex: 10,
            str: 16
        }
        const fs: FeatSheet = {
            ...defaultFeatSheet
        }
        const es: EquipmentSheet = {
            ...defaultEquipmentSheet,
            mainhand: strDagger,
        }
        // +3 from str from str dagger
        const EXPECTED_BONUS = 3
        const DAMAGE_DICE_SIDES = 4
        // + 1 from min dice roll
        const canEndEarlyFailure = (result: number) => result < EXPECTED_BONUS + 1
        const canEndEarlyPass = (result: number) => result === EXPECTED_BONUS + DAMAGE_DICE_SIDES
        const hasEnoughUniqueOutcomes = (result: number) => result === DAMAGE_DICE_SIDES

        let pass = false
        const outputs: Record<number, number> = {}
        let uniqueOutcomes = 0
        for (let i = 0; i < 10000; i++) {
            const result = act({
                cs,
                es,
                fs,
                ss: {},
            })
            assert.equal(result.length, 1)

            const damageRoll = result[0].damageRoll
            if (!outputs[damageRoll]) {
                outputs[damageRoll] = 1
                uniqueOutcomes++
            }
            else outputs[damageRoll]++

            if (canEndEarlyFailure(damageRoll)) throw Error(`Unexpectedly low number (did not sum up all bonuses): ${damageRoll}`)
            if (canEndEarlyPass(damageRoll) && hasEnoughUniqueOutcomes(uniqueOutcomes)) {
                pass = true
                break;
            }
        }
        assert.equal(pass, true)
    })
})

describe('act works with crits', () => {
    test('a plain weapon defaults to a 20 threat range and a x1.5 multiplier', () => {
        const result = act({
            cs: defaultCharacterSheet,
            es: { ...defaultEquipmentSheet, mainhand: shortsword },
            fs: defaultFeatSheet,
            ss: {},
        })

        assert.equal(result[0].critRange, 20)
        assert.equal(result[0].critMultiplier, 1.5)
    })

    test('the confirmation roll is just another attack roll: same modifier groups, its own d20', () => {
        const result = act({
            cs: defaultCharacterSheet,
            es: { ...defaultEquipmentSheet, mainhand: shortsword },
            fs: { ...defaultFeatSheet, featMeleeWeaponFighting },
            ss: {},
        })

        const theAttack = result[0]
        assert.equal(theAttack.confirmLog.groups.map(g => g.displayName).join(), theAttack.attackLog.groups.map(g => g.displayName).join())
        assert.deepEqual(theAttack.confirmLog.groups, theAttack.attackLog.groups)
        assert.equal(theAttack.confirmLog.finalResult().modifier, theAttack.attackLog.finalResult().modifier)

        // it's a fresh d20 draw, so the roll/total aren't required to match the attack roll's
        assert.equal(typeof theAttack.confirmRoll, 'number')
        assert.equal(theAttack.confirmLog.roll.length, 1)
        assert.equal(theAttack.confirmLog.roll[0].displayName, 'd20')
    })

    test('Both feats and equipment can increase threat range', () => {
        const result = act({
            cs: defaultCharacterSheet,
            es: { ...defaultEquipmentSheet, mainhand: shortsword, amulet: critAmulet },
            fs: { ...defaultFeatSheet, featImprovedCritical },
            ss: {},
        })

        assert.equal(result[0].critRange, 18)
        console.table(result[0].critRangeLog.groups)
    })

    test("Power Attack's damage bonus lands in the flat (unscaled) bucket, not the scaled one", () => {
        const result = act({
            cs: defaultCharacterSheet,
            es: { ...defaultEquipmentSheet, mainhand: shortsword },
            fs: { ...defaultFeatSheet, featPowerAttack },
            ss: {},
        })

        assert.equal(result[0].critFlatDamage.total, 4)
        assert.equal(result[0].critScaledDamage.total, 0)
    })

    test('a feat bonus that also marks itself with critMultiplier scales normally', () => {
        const result = act({
            cs: defaultCharacterSheet,
            es: { ...defaultEquipmentSheet, mainhand: shortsword },
            fs: { ...defaultFeatSheet, featMeleeWeaponFighting },
            ss: {},
        })

        assert.equal(result[0].critScaledDamage.total, 1)
        assert.equal(result[0].critFlatDamage.total, 0)

        const theAttack = result[0]
        const logs = [theAttack.attackLog, theAttack.confirmLog, theAttack.damageLog, theAttack.critRangeLog, theAttack.critMultiplierLog]

        writeFileSync(join(__dirname, 'act-result.debug.json'), JSON.stringify(toPlainModLogs(logs), null, 2))
    })
})