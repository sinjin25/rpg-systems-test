import calculateEquipmentMod from "../../../equipment-sheet/equipment-mod"
import calculateFeatMod from "../../../roll-modifier/feat-mod"
import { RollModifierResult } from "../../../roll-modifier/types"
import { calculateBaseMod } from "../../../stat-modifier"
import ModifierLog, { ModLog, namedMod } from "../../../stat-modifier/log"
import { calculateStatusMod } from "../../../status-sheet/status-mod"
import { AbilitySaveDamageOutcome } from "../../../ability-sheet"
import { AbilityActionResult, AbilityModifierRequiredData } from "./types"

export type { AbilityActionResult, AbilityModifierRequiredData } from './types'
// the Ability data model moved to ability-sheet; re-exported here for convenience
export type { Ability, AbilityCastType, AbilityKeyStat, AbilitySave, AbilitySaveDamageOutcome } from '../../../ability-sheet'

/*
an ability DC is structurally an AC, not an attack roll: a static (baseDc + mods)
value the user presents - the d20 belongs to the defender's save, rolled at
resolution time (simulate), not here. baseDc is per-ability data, not a global base 10
*/

export const abilityDcModifierFactory = (
    data: AbilityModifierRequiredData,
) => {
    return (): RollModifierResult => {
        const { cs, es, fs, ss, ability } = data

        const BASE_CONTEXT = ability.contexts
        // abilities aren't weapon-tied, so - like ac and saves - the equipment
        // mod spans all equipment
        const allEquipment = Object.values(es)

        const bm = namedMod(ability.keyStat, calculateBaseMod(cs[ability.keyStat]))
        const fm = calculateFeatMod({ cs, es, fs }, BASE_CONTEXT, 'dc')
        const em = calculateEquipmentMod(allEquipment, { cs, es, fs, ss }, BASE_CONTEXT, 'dc')
        const sm = calculateStatusMod({ cs, ss }, BASE_CONTEXT, 'dc')

        return {
            total: bm.total + fm.total + em.total + sm.total,
            groups: [
                { displayName: 'base mod', ...bm },
                { displayName: 'feat mod', ...fm },
                { displayName: 'equipment mod', ...em },
                { displayName: 'status mod', ...sm },
            ],
        }
    }
}

// mirrors damage/variants/standard.ts minus the weapon and minus the base stat:
// ability damage is dice + feat/equipment/status mods only (keyStat drives the
// DC, deliberately not the damage)
export const abilityDamageModifierFactory = (
    data: AbilityModifierRequiredData,
) => {
    return (): RollModifierResult => {
        const { cs, es, fs, ss, ability } = data

        const BASE_CONTEXT = ability.contexts
        const allEquipment = Object.values(es)

        const fm = calculateFeatMod({ cs, es, fs }, BASE_CONTEXT, 'damage')
        const em = calculateEquipmentMod(allEquipment, { cs, es, fs, ss }, BASE_CONTEXT, 'damage')
        const sm = calculateStatusMod({ cs, ss }, BASE_CONTEXT, 'damage')

        return {
            total: fm.total + em.total + sm.total,
            groups: [
                { displayName: 'feat mod', ...fm },
                { displayName: 'equipment mod', ...em },
                { displayName: 'status mod', ...sm },
            ],
        }
    }
}

// builds the passed-save damage log from the full one (confirmLog-style: same
// groups, same already-rolled base damage - no reroll) and appends the
// damageOnPass reduction as a readable 'passed save' group. the original
// entries stay intact so defender features (evasion et al.) can always
// recover the full damage from either log
export const applyDamageOnPass = (
    fullDamageLog: ModLog,
    outcome: AbilitySaveDamageOutcome,
    displayName: string,
): ModLog => {
    const log = ModifierLog(`passed save damage: ${displayName}`)
    fullDamageLog.groups.forEach(g => log.addModGroup(g.displayName, g))
    fullDamageLog.roll.forEach(r => log.addRoll(r))

    const fullTotal = fullDamageLog.finalResult().total
    const reduction = {
        // pathfinder halves round down
        half: { displayName: 'half damage (passed save)', amount: Math.floor(fullTotal / 2) - fullTotal },
        none: { displayName: 'no damage (passed save)', amount: -fullTotal },
        full: { displayName: 'full damage (passed save)', amount: 0 },
    }[outcome]
    log.addModGroup('passed save', { total: reduction.amount, entries: [reduction] })

    return log
}

// similar to act, precalc everything and rely on simulate to resolve what's relevant (ex: whether to use damageRoll or passedSaveDamageRoll)
export const useAbility = (
    data: AbilityModifierRequiredData,
): AbilityActionResult => {
    const { ability } = data

    const result: AbilityActionResult = { ability }

    if (ability.save) {
        const dcMod = abilityDcModifierFactory(data)()
        const dcLog = ModifierLog(`ability dc: ${ability.displayName}`)
        dcLog.addModGroup('base dc', namedMod('base dc', ability.save.baseDc))
        dcMod.groups.forEach(g => dcLog.addModGroup(g.displayName, g))

        result.save = {
            type: ability.save.type,
            dcLog,
            // convenience only
            get dc() { return dcLog.finalResult().total },
        }
    }

    if (ability.damage) {
        const damageMod = abilityDamageModifierFactory(data)()
        const damageLog = ModifierLog(`ability damage: ${ability.displayName}`)
        damageMod.groups.forEach(g => damageLog.addModGroup(g.displayName, g))
        damageLog.addRoll({ displayName: `${ability.displayName} base damage`, amount: ability.damage(data) })

        const passedSaveDamageLog = ability.save
            ? applyDamageOnPass(damageLog, ability.save.damageOnPass, ability.displayName)
            : undefined

        result.damage = {
            damageLog,
            passedSaveDamageLog,
            // convenience only
            get damageRoll() { return damageLog.finalResult().total },
            get passedSaveDamageRoll() { return passedSaveDamageLog?.finalResult().total },
        }
    }

    return result
}

export default useAbility
