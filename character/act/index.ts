import { calculateBaseMod, finesseAttackModifierFactory, standardAttackModifierFactory } from "../../attack"
import { CharacterSheet } from "../../character-sheet"
import { equipmentIsWeapon, EquipmentSheet, Weapon } from "../../equipment-sheet"
import { FeatSheet } from "../../feat"
import roll from "../../roll"

type ActRequiredData = {
    characterSheet: CharacterSheet,
    featSheet: FeatSheet,
    equipmentSheet: EquipmentSheet,
    statusSheet: {},
}

type StandardActionResult = {
    attackRoll: number,
    damageRoll: number,
}

/* const standardAction = (data: ActRequiredData, relevantEquipment: Weapon) => {
    if (relevantEquipment.contexts.includes('finesse')) return {
        attack: finesseAttackModifierFactory(data),
        damage: relevantEquipment.damage
    }
} */

export const act = (data: ActRequiredData) => {
    // you just attack right now

    const actions: Weapon[] = []
    if (data.equipmentSheet.twohanded
        && equipmentIsWeapon(data.equipmentSheet.twohanded)
    ) {
        actions.push(data.equipmentSheet.twohanded)
    } else if (data.equipmentSheet.mainhand
        && equipmentIsWeapon(data.equipmentSheet.mainhand)
    ) {
        actions.push(data.equipmentSheet.mainhand)
    }

    if (data.equipmentSheet.offhand
        && equipmentIsWeapon(data.equipmentSheet.offhand)
    ) {
        actions.push(data.equipmentSheet.offhand)
    }

    // resolve actions
    const results: StandardActionResult[] = [] // attack and damage rolls
    while (actions.length) {
        const item = actions.pop()!
        if (!item.damage) continue // should never happen

        const attackRoll = item.contexts.includes('finesse')
            ? finesseAttackModifierFactory({
                ...data,
                weapon: item,
            })() + roll(20)
            : standardAttackModifierFactory({
                ...data,
                weapon: item,
            })() + roll(20)

        const damageRoll = item.contexts.includes('finesse')
            ? item.damage() + calculateBaseMod(data.characterSheet.dex)
            : item.damage() + calculateBaseMod(data.characterSheet.str)

        /* console.log('this ran a finesse attack?', item.contexts.includes('finesse')) */
        results.push({
            attackRoll,
            damageRoll,
        })
    }

    return results
}