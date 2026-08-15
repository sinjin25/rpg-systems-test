import { Actor2, createDefaultOwner } from "../../actor2"
import { leaf, ModNode } from "../../log2"
import dc from "../../log2/terminal/dc"
import { StatusEffect } from "../../status-sheet2"
import target from "../../target"
import { TargetPriority } from "../../target/types"
import { AbilityCastType } from "../types"

export type AbilitySheetDefinition = {
    castType: AbilityCastType,
    displayName: string,
    description?: string,
    factory: () => Ability
}

export type AbilityPayload = {
    damage?: ModNode[],
    heal?: ModNode[],
    statusEffect?: StatusEffect[],
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
    dc?: {
        base: number,
        saveType: 'reflex' | 'fortitude' | 'will',
    }, // base dc
    onSuccess: (source: Actor2, target: Actor2) => AbilityPayload
    onFailure?: (source: Actor2, target: Actor2) => AbilityPayload
}

export type DiscreteTargetGroup = {
    tp: TargetPriority,
    payload: DiscreteTargetGroupPayload[]
}

export type Ability = {
    steps: DiscreteTargetGroup[]
}