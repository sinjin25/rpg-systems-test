import { Actor2, createDefaultOwner } from "../../actor2"
import { leaf, ModNode } from "../../log2"
import dc from "../../log2/terminal/dc"
import { StatusEffectWrapper } from "../../status-sheet2"
import target from "../../target"
import { TargetPriority } from "../../target/types"
import { AbilityCastType } from "../types"

export type AbilitySheetDefinition = {
    kind?: 'save', // discriminant vs AttackAbilitySheetDefinition; absent reads as 'save'
    castType: AbilityCastType,
    displayName: string,
    description?: string,
    factory: () => Ability
}

export type AbilityPayload = {
    damage?: ModNode[],
    heal?: ModNode[],
    statusEffect?: StatusEffectWrapper[],
}

export type DiscreteTargetGroupPayloadResolution = {
    source: Actor2,
    target: Actor2,
    type: 'success' | 'failure'
    dc?: ModNode
    saveType?: 'reflex' | 'fortitude' | 'will'
    save?: ModNode,
} & AbilityPayload

export type DiscreteTargetGroupPayload = {
    chainOnly?: boolean, // subsequent items only resolve if the defender failed their save (see shouldTGPRContinue)
    dc?: {
        base: number,
        saveType: 'reflex' | 'fortitude' | 'will',
    }, // base dc
    // or if no dc, always run onSaveFailure
    onSaveFailure: (source: Actor2, target: Actor2) => AbilityPayload
    onSavePass?: (source: Actor2, target: Actor2) => AbilityPayload
}

export type DiscreteTargetGroup = {
    tp: TargetPriority,
    payload: DiscreteTargetGroupPayload[]
}

export type Ability = {
    steps: DiscreteTargetGroup[]
}