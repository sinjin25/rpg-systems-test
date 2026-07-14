import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet } from "../equipment-sheet"
import { FeatSheet } from "../feat/types"
import { FeatModRequiredData } from "../feat/core-types"
import { StatusSheet } from "../status-sheet/types"
import { applyTriggerEffect, TriggerEffectOwners } from "./apply"
import { TriggerEffect, TriggerHookName, TriggerHooks } from "./core-types"

export type TriggerOwnerData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
}

type TriggerCapableSheet = Record<string, { trigger?: TriggerHooks } | undefined>

const collectTriggerEffects = (
    sheet: TriggerCapableSheet,
    hook: TriggerHookName,
    data: Partial<FeatModRequiredData>,
): TriggerEffect[] => {
    const effects: TriggerEffect[] = []
    for (const entry of Object.values(sheet)) {
        const result = entry?.trigger?.[hook]?.(data)
        if (!result) continue
        effects.push(...(Array.isArray(result) ? result : [result]))
    }
    return effects
}

// simulate/index.ts resolveAction is responsible for running this at the moment
// Collect things that have a trigger hook (ex: onMiss)
// Apply it to the target self is the origin of the hook (ex: the attacker's feats)
// onDamageTaken, 'target' is the other party in the exchange
export const runTrigger = (
    owners: { self: TriggerOwnerData, target: TriggerOwnerData },
    hook: TriggerHookName,
) => {
    const effects = [
        ...collectTriggerEffects(owners.self.fs, hook, owners.self),
        ...collectTriggerEffects(owners.self.ss, hook, owners.self),
    ]
    const applyOwners: TriggerEffectOwners = owners
    effects.forEach(effect => applyTriggerEffect(applyOwners, effect))
}

export default runTrigger
