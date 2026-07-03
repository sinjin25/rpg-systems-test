import { finesseAttackModifierFactory, standardAttackModifierFactory } from "../../attack"
import { finesseDamageModifierFactory, standardDamageModifierFactory } from "../../damage"
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

const weaponIsTwoHanded = (es: EquipmentSheet) => es.twohanded && equipmentIsWeapon(es.twohanded)
const weaponIsPrimary = (es: EquipmentSheet) => es.mainhand && equipmentIsWeapon(es.mainhand)
const weaponIsOffhand = (es: EquipmentSheet) => es.offhand && equipmentIsWeapon(es.offhand)

export const act = (data: ActRequiredData) => {
    // you just attack right now

    const actions: Weapon[] = []

    if (weaponIsTwoHanded(data.equipmentSheet)) actions.push(data.equipmentSheet.twohanded as Weapon)
    else {
        if (weaponIsPrimary(data.equipmentSheet)) actions.push(data.equipmentSheet.mainhand as Weapon)
        if (weaponIsOffhand(data.equipmentSheet)) actions.push(data.equipmentSheet.offhand as Weapon)
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
            ? item.damage() + finesseDamageModifierFactory({
                ...data,
                weapon: item,
            })()
            : item.damage() + standardDamageModifierFactory({
                ...data,
                weapon: item,
            })()

        results.push({
            attackRoll,
            damageRoll,
        })
    }

    return results
}