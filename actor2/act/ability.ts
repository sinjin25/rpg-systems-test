import { Actor2 } from ".."
import { AbilityCastType, AbilitySheetDefinition, DiscreteTargetGroupPayloadResolution } from "../../ability-sheet2"
import { applyDamage, applyHeal } from "../../health"
import { addStatusToStatusSheet } from "../../status-sheet2"

export const applyResolutions = (resolutions: DiscreteTargetGroupPayloadResolution[]) => {
    for (const r of resolutions) {
        if (r.damage) for (const node of r.damage) applyDamage(r.target.health, node.total())
        if (r.heal) for (const node of r.heal) applyHeal(r.target.health, node.total())
        if (r.statusEffect) addStatusToStatusSheet(r.target.owner, ...r.statusEffect)
    }
}

export const selectAndPrepAbility = (
    caster: Actor2,
    category: AbilityCastType
): undefined | AbilitySheetDefinition => {
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
