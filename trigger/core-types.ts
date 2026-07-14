import type { StatusEffect } from "../status-sheet/core-types"
import type { FeatModRequiredData } from "../feat/core-types"

export type TriggerEffectApplyStatus = {
    kind: 'apply-status',
    recipient: 'self' | 'target',
    key: string,
    status: StatusEffect,
}

export type TriggerEffect = TriggerEffectApplyStatus

// invoked from simulate/index.ts's attack resolution in reaction to an attack's
// outcome (hit/miss/crit/kill/damage-taken)
export type FeatTriggerFunction = (data?: Partial<FeatModRequiredData>) => TriggerEffect | TriggerEffect[] | undefined

export type TriggerHookName = 'onHit' | 'onMiss' | 'onCrit' | 'onKill' | 'onDamageTaken'

// group keys, attach to something (ex: Feats.triggers)
export type TriggerHooks = {
    [K in TriggerHookName]?: FeatTriggerFunction
}
