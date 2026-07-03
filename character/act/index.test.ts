import { dagger, daggerPlusOne, RingPlusOneFinesseAttack, shortsword } from "../../equipment-sheet/variants/dagger";
import { CharacterSheet, defaultCharacterSheet } from "../../character-sheet";
import { defaultFeatSheet, FeatSheet } from "../../feat";
import { describe, test, assert, expect } from 'vitest'
import { defaultEquipmentSheet, EquipmentSheet } from "../../equipment-sheet";
import { act } from "./index.ts";
import { featMeleeWeaponFighting } from "../../feat/feats/index.ts";

describe('act works with attacks', () => {
    test('Simplest standard attack', () => {
        const result = act({
            characterSheet: defaultCharacterSheet,
            equipmentSheet: {
                ...defaultEquipmentSheet,
                mainhand: shortsword
            },
            featSheet: defaultFeatSheet,
            statusSheet: {},
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
                characterSheet: cs,
                equipmentSheet: es,
                featSheet: fs,
                statusSheet: {},
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
        console.log(outputs, 'unique outcomes', uniqueOutcomes)
        assert.equal(pass, true)
    })
})