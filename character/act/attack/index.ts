import { finesseAttackModifierFactory, standardAttackModifierFactory } from "../../../attack"
import { finesseDamageModifierFactory, standardDamageModifierFactory } from "../../../damage"
import { ContextNames } from "../../../contexts"
import { critRangeModifierFactory, critMultiplierModifierFactory, calculateScaledDamage } from "../../../crit2"
import { equipmentIsWeapon, EquipmentSheet, Weapon } from "../../../equipment-sheet"
import { extractContextsTags } from "../../../equipment-sheet/extract"
import roll from "../../../roll"
import ModifierLog, { ModLog } from "../../../stat-modifier/log"
import { AttackRequiredData, StandardActionResult } from "./types"

export type { AttackRequiredData, StandardActionResult } from './types'

type PrecalcFuncOutput = [ModLog, number]

const _precalcAttack = (data: AttackRequiredData, opts: {
    weapon: Weapon,
    isFinesse: boolean,
}): PrecalcFuncOutput => {
    const { isFinesse, weapon } = opts

    const attackMod = (isFinesse ? finesseAttackModifierFactory : standardAttackModifierFactory)({
        ...data,
        weapon,
    })()
    const modlog = ModifierLog(`attack: ${weapon.displayName}`)
    attackMod.groups.forEach(g => modlog.addModGroup(g.displayName, g))
    modlog.addRoll({ displayName: 'd20', amount: roll(20) })
    const r = modlog.finalResult().total

    return [modlog, r]
}

// literally just another attack
const _precalcConfirm = (data: AttackRequiredData, opts: {
    weapon: Weapon,
    isFinesse: boolean,
}): PrecalcFuncOutput => {
    const { isFinesse, weapon } = opts

    const attackMod = (isFinesse ? finesseAttackModifierFactory : standardAttackModifierFactory)({
        ...data,
        weapon,
    })()
    const modlog = ModifierLog(`crit confirmation: ${weapon.displayName}`)
    attackMod.groups.forEach(g => modlog.addModGroup(g.displayName, g))
    modlog.addRoll({ displayName: 'd20', amount: roll(20) })
    const r = modlog.finalResult().total

    return [modlog, r]
}

const _precalcDamage = (data: AttackRequiredData, opts: {
    weapon: Weapon,
    isFinesse: boolean,
}): PrecalcFuncOutput => {
    const { isFinesse, weapon } = opts

    const damageMod = (isFinesse ? finesseDamageModifierFactory : standardDamageModifierFactory)({
        ...data,
        weapon,
    })()
    const modlog = ModifierLog(`damage: ${weapon.displayName}`)
    damageMod.groups.forEach(g => modlog.addModGroup(g.displayName, g))
    modlog.addRoll({ displayName: `${weapon.displayName} base damage`, amount: weapon.damage(data) })
    const r = modlog.finalResult().total

    return [modlog, r]
}

const _precalcCritRange = (data: AttackRequiredData, opts: {
    weapon: Weapon,
}): PrecalcFuncOutput => {
    const { weapon } = opts

    const rangeMod = critRangeModifierFactory({ ...data, weapon })()
    const modlog = ModifierLog('crit range')
    rangeMod.groups.forEach(g => modlog.addModGroup(g.displayName, g))
    const r = modlog.finalResult().total

    return [modlog, r]
}

const _precalcCritMultiplier = (data: AttackRequiredData, opts: {
    weapon: Weapon,
}): PrecalcFuncOutput => {
    const { weapon } = opts

    const multiplierMod = critMultiplierModifierFactory({ ...data, weapon })()
    const modlog = ModifierLog('crit multiplier')
    multiplierMod.groups.forEach(g => modlog.addModGroup(g.displayName, g))
    const r = modlog.finalResult().total

    return [modlog, r]
}

const weaponIsTwoHanded = (es: EquipmentSheet) => es.twohanded && equipmentIsWeapon(es.twohanded)
const weaponIsPrimary = (es: EquipmentSheet) => es.mainhand && equipmentIsWeapon(es.mainhand)
const weaponIsOffhand = (es: EquipmentSheet) => es.offhand && equipmentIsWeapon(es.offhand)

// similar to useAbility: precalc every roll for each equipped weapon, target-blind,
// and rely on simulate to interpret them
export const useAttack = (data: AttackRequiredData): StandardActionResult[] => {
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

        const [attackLog, attackRoll] = _precalcAttack(data, {
            weapon: item,
            isFinesse,
        })

        const [confirmLog, confirmRoll] = _precalcConfirm(data, {
            weapon: item,
            isFinesse,
        })

        const [damageLog, damageRoll] = _precalcDamage(data, {
            weapon: item,
            isFinesse,
        })

        const BASE_DAMAGE_CONTEXT = (isFinesse ? ['finesse', 'melee'] : []) as ContextNames[]
        const critContext = [...BASE_DAMAGE_CONTEXT, ...extractContextsTags(item)]

        const [critRangeLog, critRange] = _precalcCritRange(data, {
            weapon: item,
        })

        const [critMultiplierLog, critMultiplier] = _precalcCritMultiplier(data, {
            weapon: item,
        })

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

export default useAttack
