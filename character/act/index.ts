import { finesseAttackModifierFactory, standardAttackModifierFactory } from "../../attack"
import { finesseDamageModifierFactory, standardDamageModifierFactory } from "../../damage"
import { CharacterSheet } from "../../character-sheet"
import { equipmentIsWeapon, EquipmentSheet, Weapon } from "../../equipment-sheet"
import { FeatSheet } from "../../feat"
import roll from "../../roll"
import ModifierLog, { ModLog } from "../../stat-modifier/log"

type ActRequiredData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: {},
}

type StandardActionResult = {
    attackRoll: number,
    damageRoll: number,
    attackLog: ModLog,
    damageLog: ModLog,
}

const weaponIsTwoHanded = (es: EquipmentSheet) => es.twohanded && equipmentIsWeapon(es.twohanded)
const weaponIsPrimary = (es: EquipmentSheet) => es.mainhand && equipmentIsWeapon(es.mainhand)
const weaponIsOffhand = (es: EquipmentSheet) => es.offhand && equipmentIsWeapon(es.offhand)

export const act = (data: ActRequiredData) => {
    // you just attack right now

    const actions: Weapon[] = []

    if (weaponIsTwoHanded(data.es)) actions.push(data.es.twohanded as Weapon)
    else {
        if (weaponIsPrimary(data.es)) actions.push(data.es.mainhand as Weapon)
        if (weaponIsOffhand(data.es)) actions.push(data.es.offhand as Weapon)
    }

    // resolve actions
    const results: StandardActionResult[] = [] // attack and damage rolls
    while (actions.length) {
        const item = actions.pop()!
        if (!item.damage) continue // should never happen

        const isFinesse = item.contexts.includes('finesse')

        const attackMod = (isFinesse ? finesseAttackModifierFactory : standardAttackModifierFactory)({
            ...data,
            weapon: item,
        })()
        const attackLog = ModifierLog(`attack: ${item.displayName}`)
        attackMod.groups.forEach(g => attackLog.addModGroup(g.displayName, g))
        attackLog.addRoll({ displayName: 'd20', amount: roll(20) })
        const attackRoll = attackLog.finalResult().total

        const damageMod = (isFinesse ? finesseDamageModifierFactory : standardDamageModifierFactory)({
            ...data,
            weapon: item,
        })()
        const damageLog = ModifierLog(`damage: ${item.displayName}`)
        damageMod.groups.forEach(g => damageLog.addModGroup(g.displayName, g))
        damageLog.addRoll({ displayName: `${item.displayName} base damage`, amount: item.damage(data) })
        const damageRoll = damageLog.finalResult().total

        results.push({
            attackRoll,
            damageRoll,
            attackLog,
            damageLog,
        })
    }

    return results
}