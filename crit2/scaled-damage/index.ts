import { ContextNames } from "../../contexts"
import { equipmentIsWeapon } from "../../equipment-sheet"
import { RollModifierRequiredData } from "../../roll-modifier/types"
import { splitScaledDamage, ScaledDamageSplit } from "../split-scaled-damage"

// gathers every 'damage' mod source (feats, equipment, statuses) - the same sources
// standardDamageModifierFactory/finesseDamageModifierFactory total up - and splits their
// contribution into scaled vs flat (see split-scaled-damage/index.ts)
export const calculateScaledDamage = (
    data: RollModifierRequiredData,
    context: ContextNames[],
): ScaledDamageSplit => {
    const feats = Object.values(data.fs)
    const notWeaponEquipment = Object.values(data.es).filter(a => !equipmentIsWeapon(a))
    const equipmentSources = [...notWeaponEquipment, data.weapon].flatMap(e => e?.generateAdditionalContexts ?? [])
    const statuses = Object.values(data.ss)

    const featSplit = splitScaledDamage(feats, f => f.context, f => f.displayName, data, context)
    const equipSplit = splitScaledDamage(equipmentSources, e => e.context, e => e.displayName, data, context)
    const statusSplit = splitScaledDamage(statuses, s => s.context, s => s.displayName, data, context)

    return {
        scaled: {
            total: featSplit.scaled.total + equipSplit.scaled.total + statusSplit.scaled.total,
            entries: [...featSplit.scaled.entries, ...equipSplit.scaled.entries, ...statusSplit.scaled.entries],
        },
        flat: {
            total: featSplit.flat.total + equipSplit.flat.total + statusSplit.flat.total,
            entries: [...featSplit.flat.entries, ...equipSplit.flat.entries, ...statusSplit.flat.entries],
        },
    }
}

export default calculateScaledDamage
