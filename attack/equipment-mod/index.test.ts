import { CharacterSheet, defaultCharacterSheet } from '../../character-sheet'
import { defaultEquipmentSheet, EquipmentSheet } from '../../equipment-sheet'
import { defaultFeatSheet, FeatSheet } from '../../feat'
import { ContextNames } from '../../contexts'
import { FeatAppliesContext, standardFilters } from '../../feat/core-types'
import roll from '../../roll'
import { CalculateEquipmentModRequiredData, calculateAttackEquipmentMod } from './index'
import { describe, test, assert, expect } from 'vitest'
import { daggerPlusOne, RingPlusOneFinesseAttack, shortsword } from '../../defaults/equipment'

describe('Correctly filters', () => {
    test('correctly filters', () => {
        const contexts: ContextNames[] = ['finesse', 'melee']
        const fs: FeatSheet = defaultFeatSheet
        const cs: CharacterSheet = defaultCharacterSheet
        const es: EquipmentSheet = {
            ...defaultEquipmentSheet,
            mainhand: daggerPlusOne,
            ring: RingPlusOneFinesseAttack,
        }

        const result = calculateAttackEquipmentMod({
            characterSheet: cs,
            equipmentSheet: es,
            featSheet: fs,
            weapon: es.mainhand!
        }, contexts, 'attack')

        assert.equal(result.total, 2)
    })
    test('correctly filters wrong inapplicable equipment', () => {
        // in this test, the finesse ring should not apply because the contexts isn't right (it should still find the ring though)
        const contexts: ContextNames[] = ['melee']
        const fs: FeatSheet = defaultFeatSheet
        const cs: CharacterSheet = defaultCharacterSheet
        const es: EquipmentSheet = {
            ...defaultEquipmentSheet,
            mainhand: shortsword,
            ring: RingPlusOneFinesseAttack,
        }

        const result = calculateAttackEquipmentMod({
            characterSheet: cs,
            equipmentSheet: es,
            featSheet: fs,
            weapon: es.mainhand!
        }, contexts, 'attack')

        assert.equal(result.total, 0)
    })
})