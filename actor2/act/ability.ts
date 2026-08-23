import { Actor2 } from ".."
import { AbilityCastType, AnyAbilitySheetDefinition, AttackDiscreteTargetGroupPayloadResolution, DiscreteTargetGroupPayloadResolution } from "../../ability-sheet2"
import { applyDamage, applyHeal } from "../../health"
import damageTakenTree from '../../log2/terminal-composition/damage-taken'
import { OwnerLog2 } from '../../log2/types'
import { addStatusToStatusSheet } from "../../status-sheet2"

export const applyResolutions = (resolutions: DiscreteTargetGroupPayloadResolution[]) => {
    return resolutions.map(r => {
        const damageTaken: ReturnType<ReturnType<typeof damageTakenTree>>[] = []
        if (r.damage) for (const node of r.damage) {
            const dt = damageTakenTree({ node })(r.target.owner as unknown as OwnerLog2)
            damageTaken.push(dt)
            applyDamage(r.target.health, dt.total())
        }
        if (r.heal) for (const node of r.heal) applyHeal(r.target.health, node.total())
        if (r.statusEffect) addStatusToStatusSheet(r.target.owner, r.source.owner, ...r.statusEffect)
        return { r, damageTaken }
    })
}

// like applyResolutions, but weapon damage lives in the resolved SAR (crit takes precedence, matching
// the raw-SAR handling in simulate2); the hook's AbilityPayload is additive on top.
export const applyAttackResolutions = (resolutions: AttackDiscreteTargetGroupPayloadResolution[]) => {
    return resolutions.map(r => {
        const weapon = r.sar.critDamageResult ?? r.sar.damageResult
        const targetOwnerLog2 = r.target.owner as unknown as OwnerLog2
        let damageTakenResult: ReturnType<ReturnType<typeof damageTakenTree>> | undefined
        if (weapon) {
            damageTakenResult = damageTakenTree({ node: weapon })(targetOwnerLog2)
            applyDamage(r.target.health, damageTakenResult.total())
        }
        if (r.damage) for (const node of r.damage) applyDamage(r.target.health, damageTakenTree({ node })(targetOwnerLog2).total())
        if (r.heal) for (const node of r.heal) applyHeal(r.target.health, node.total())
        if (r.statusEffect) addStatusToStatusSheet(r.target.owner, r.source.owner, ...r.statusEffect)

        // effects routed back to the source (recoil, self-buff, ...) - only present if a hook set it
        if (r.self) {
            if (r.self.damage) for (const node of r.self.damage) applyDamage(r.source.health, damageTakenTree({ node })(r.source.owner as unknown as OwnerLog2).total())
            if (r.self.heal) for (const node of r.self.heal) applyHeal(r.source.health, node.total())
            if (r.self.statusEffect) addStatusToStatusSheet(r.source.owner, r.source.owner, ...r.self.statusEffect)
        }
        return { r, damageTakenResult }
    })
}

export const selectAndPrepAbility = (
    caster: Actor2,
    category: AbilityCastType
): undefined | AnyAbilitySheetDefinition => {
    const { as } = caster.owner

    // do we even have items to pick?
    const catalog = as[category]
    const OUT_OF_ITEMS_INDEX = -1
    const HAS_ITEMS = catalog.priority.length > 0
    if (!HAS_ITEMS || catalog.index === OUT_OF_ITEMS_INDEX) return undefined

    const key = catalog.priority[catalog.index]
    if (!key) return undefined

    const item = catalog.items[key]
    if (!item) return undefined

    return item
}
