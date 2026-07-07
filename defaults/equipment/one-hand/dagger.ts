import { createEquipment } from '../../../equipment-sheet/create-equipment.ts'
import { DamageRollFunc } from '../../../equipment-sheet/index.ts'
import roll from '../../../roll/index.ts'
import { CharacterSheet, defaultCharacterSheet } from '../../../character-sheet/index.ts'
import { calculateBaseMod } from '../../../stat-modifier/index.ts'
import { FeatModRequiredData } from '../../../feat/core-types.ts'

export const dagger = createEquipment({
    displayName: 'dagger',
    contexts: ['finesse', 'dagger', 'melee'],
    damage: () => roll(4),
})

export const daggerPlusOne = createEquipment({
    displayName: '+1 dagger',
    contexts: ['finesse', 'dagger', 'melee'],
    damage: () => roll(4), // pure base dice; the +1 comes from the enhancement
    enhancement: 1,
})

export const strDagger = createEquipment({
    displayName: 'strength dagger',
    contexts: ['finesse', 'dagger', 'melee'],
    description: 'does more damage based on character strength, in addition to standard modifiers',
    damage: (data?: Partial<FeatModRequiredData>) => {
        if (!data || !data.characterSheet) return roll(4)

        const str = calculateBaseMod(data.characterSheet.str)
        return roll(4) + str
    },
})