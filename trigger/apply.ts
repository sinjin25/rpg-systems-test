import { StatusSheet } from "../status-sheet/types"
import { TriggerEffect, TriggerEffectApplyStatus } from "./core-types"

export type TriggerEffectOwners = {
    self: { ss: StatusSheet },
    target: { ss: StatusSheet },
}

// non-stacking: if the recipient already has a status under this key, the new
// one is dropped rather than overwriting it (matches Fatiguing Blows' design)
export const applyStatusTriggerEffect = (
    owners: TriggerEffectOwners,
    effect: TriggerEffectApplyStatus,
) => {
    const owner = owners[effect.recipient]
    if (owner.ss[effect.key]) return
    owner.ss[effect.key] = effect.status
}

export const applyTriggerEffect = (
    owners: TriggerEffectOwners,
    effect: TriggerEffect,
) => {
    switch (effect.kind) {
        case 'apply-status': return applyStatusTriggerEffect(owners, effect)
    }
}

export default applyTriggerEffect
