// an attack-ability inherits from attack and provides additional augments
// we basically provide a tree for each element of a standardActionResult

import { Actor2 } from "../../actor2"
import { FinalStandardActionResult, StandardActionResult } from "../../actor2/act"
import { ModNode } from "../../log2"
import { TargetPriority } from "../../target/types"
import { AbilityCastType } from "../types"
import { AbilityPayload } from "../abilities2/types"

export type SARAgainstTargetOpts = {
    canMiss: boolean,
    canCrit: boolean,
    mustCrit: boolean, // force a guaranteed crit (implies hit + threat + confirm); wins over canMiss/canCrit
    nat1HitFails: boolean,
    nat20HitHits: boolean,
    nat1ThreatFails: boolean,
    nat20ThreatSucceeds: boolean,
}

// only the node-valued fields of a SAR can be augmented (relevantSlot is equipment, not a node)
type SARNodeField = Exclude<keyof StandardActionResult, 'relevantSlot'>

type SARAugment = {
    // replace calculation entirely; may read live state
    override?: (source: Actor2, target: Actor2) => ModNode,
    // add a child to a calculation; a static ModNode or a function of live state
    mod?: ModNode | ((source: Actor2, target: Actor2) => ModNode),
}

type SARAugments = Partial<Record<SARNodeField, SARAugment>>

// a hook may return effects for the target (as an AbilityPayload) plus, via `self`, effects routed
// back to the source - applied only because this hook fired (e.g. recoil/self-buff on a hit).
export type AttackEffectPayload = AbilityPayload & { self?: AbilityPayload }

type AttackEffect = (source: Actor2, target: Actor2) => AttackEffectPayload

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
    // override the resolution rules for this payload (never miss/crit, disable nat-1/nat-20, ...);
    // merged over RESOLVE_PAYLOAD_DEFAULT_OPTS and passed to sarAgainstTarget
    opts?: Partial<SARAgainstTargetOpts>,
} & AttackEffectHooks

export type AttackDiscreteTargetGroupPayloadResolution = {
    source: Actor2,
    target: Actor2,
    hook: keyof AttackEffectHooks,
    sar: FinalStandardActionResult,
    self?: AbilityPayload, // effects applied back to the source (present only if the fired hook set it)
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