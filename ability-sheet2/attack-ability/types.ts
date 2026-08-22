// an attack-ability inherits from attack and provides additional augments
// we basically provide a tree for each element of a standardActionResult

import { Actor2 } from "../../actor2"
import { FinalStandardActionResult, StandardActionResult } from "../../actor2/act"
import { ModNode } from "../../log2"
import { TargetPriority } from "../../target/types"
import { AbilityCastType } from "../types"
import { AbilityPayload } from "../abilities2/types"

// only the node-valued fields of a SAR can be augmented (relevantSlot is equipment, not a node)
type SARNodeField = Exclude<keyof StandardActionResult, 'relevantSlot'>

type SARAugment = {
    // replace calculation entirely
    override?: () => ModNode,
    // add a child to a calculation
    mod?: ModNode,
}

type SARAugments = Partial<Record<SARNodeField, SARAugment>>

type AttackEffect = (source: Actor2, target: Actor2) => AbilityPayload

// ONLY ONE of these will 'trigger'. Optional with fallthrough (see resolvePayload):
// onCrit -> onHit, onThreaten -> onHit, and any missing hook is a no-op.
type AttackEffectHooks = {
    onMiss?: AttackEffect,
    onHit?: AttackEffect,
    onThreaten?: AttackEffect,
    onCrit?: AttackEffect,
}

export type AttackDiscreteTargetGroupPayload = {
    chainOnly?: boolean, // subsequent items only resolve if the defender failed their save (see shouldTGPRContinue)
    // augment some part of the SAR in some way
    augments?: SARAugments,
} & AttackEffectHooks

export type AttackDiscreteTargetGroupPayloadResolution = {
    source: Actor2,
    target: Actor2,
    hook: keyof AttackEffectHooks,
    sar: FinalStandardActionResult,
} & AbilityPayload

export type AttackDiscreteTargetGroup = {
    tp: TargetPriority,
    payload: AttackDiscreteTargetGroupPayload[],
}

export type AttackAbility = {
    steps: AttackDiscreteTargetGroup[],
}

// registration/dispatch wrapper, mirroring AbilitySheetDefinition. The `kind` discriminant is what
// lets act()/simulate tell an attack ability apart from a save ability (both carry a castType).
export type AttackAbilitySheetDefinition = {
    kind: 'attack',
    castType: AbilityCastType,
    displayName: string,
    description?: string,
    factory: () => AttackAbility,
}