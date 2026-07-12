import { finesseAttackModifierFactory, standardAttackModifierFactory } from "../../attack"
import { finesseDamageModifierFactory, standardDamageModifierFactory } from "../../damage"
import { CharacterSheet } from "../../character-sheet"
import { ContextNames } from "../../contexts"
import { critRangeModifierFactory, critMultiplierModifierFactory, calculateScaledDamage } from "../../crit2"
import { equipmentIsWeapon, EquipmentSheet, Weapon } from "../../equipment-sheet"
import { extractContextsTags } from "../../equipment-sheet/extract"
import { FeatSheet } from "../../feat"
import roll from "../../roll"
import ModifierLog, { ModLog, ModResult } from "../../stat-modifier/log"
import { StatusSheet } from "../../status-sheet"

type ActRequiredData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
}

export type StandardActionResult = {
    attackRoll: number,
    damageRoll: number,
    attackLog: ModLog,
    damageLog: ModLog,
    weapon: Weapon,

    // a fresh attack roll against the same modifier, precomputed the same way damageRoll
    // is - blind to the target - so simulate can use it to confirm a threatened crit
    // without needing a separate "confirm" concept; it's just another attack roll
    confirmRoll: number,
    confirmLog: ModLog,

    critRange: number,
    critMultiplier: number,
    critRangeLog: ModLog,
    critMultiplierLog: ModLog,

    critScaledDamage: ModResult,
    critFlatDamage: ModResult,
}

/*
act will precompute everything but has no opinions on interpreting them
Ex: damage will roll even if the attack will not hit
Ex: crit confirmation will roll even if the attack does not threaten
Ex: crit multiplier is determined but it doesn't know how that's applied to damage (some things scale, some don't)

simulate is responsible for interpreting these against targets
*/

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

        // a crit confirmation is just another attack roll against the same modifier -
        // precomputed here, blind to the target, same as attackRoll/damageRoll
        const confirmLog = ModifierLog(`crit confirmation: ${item.displayName}`)
        attackMod.groups.forEach(g => confirmLog.addModGroup(g.displayName, g))
        confirmLog.addRoll({ displayName: 'd20', amount: roll(20) })
        const confirmRoll = confirmLog.finalResult().total

        const damageMod = (isFinesse ? finesseDamageModifierFactory : standardDamageModifierFactory)({
            ...data,
            weapon: item,
        })()
        const damageLog = ModifierLog(`damage: ${item.displayName}`)
        damageMod.groups.forEach(g => damageLog.addModGroup(g.displayName, g))
        damageLog.addRoll({ displayName: `${item.displayName} base damage`, amount: item.damage(data) })
        const damageRoll = damageLog.finalResult().total

        const BASE_DAMAGE_CONTEXT = (isFinesse ? ['finesse', 'melee'] : []) as ContextNames[]
        const critContext = [...BASE_DAMAGE_CONTEXT, ...extractContextsTags(item)]

        const rangeMod = critRangeModifierFactory({ ...data, weapon: item })()
        const critRangeLog = ModifierLog('crit range')
        rangeMod.groups.forEach(g => critRangeLog.addModGroup(g.displayName, g))
        const critRange = critRangeLog.finalResult().total

        const multiplierMod = critMultiplierModifierFactory({ ...data, weapon: item })()
        const critMultiplierLog = ModifierLog('crit multiplier')
        multiplierMod.groups.forEach(g => critMultiplierLog.addModGroup(g.displayName, g))
        const critMultiplier = critMultiplierLog.finalResult().total

        const { scaled, flat } = calculateScaledDamage({ ...data, weapon: item }, critContext)

        results.push({
            attackRoll,
            damageRoll,
            attackLog,
            damageLog,
            weapon: item,
            confirmRoll,
            confirmLog,
            critRange,
            critMultiplier,
            critRangeLog,
            critMultiplierLog,
            critScaledDamage: scaled,
            critFlatDamage: flat,
        })
    }

    return results
}