import { DiscreteTargetGroupPayloadResolution } from "../ability-sheet2"
import { FinalStandardActionResult } from "../actor2/act"
import { BaseEquipment } from "../equipment-sheet2/types"
import { ModNode } from "../log2"
import { Saves } from "../log2/types"
import { StatusEffect, StatusEffectInstance } from "../status-sheet2"
import { Actor2Snapshot } from "./snapshot/actor"

export type FrozenModNode = {
    displayName: string
    children: FrozenModNode[]
    total: number
}

export type FrozenExpiration = {
    dc?: FrozenModNode,
    kind: NonNullable<StatusEffectInstance['expiration']>['kind'],
    remaining?: number,
    saveType?: Saves
    /* enemy?: {} */
}
export type FrozenStatus = Pick<StatusEffect, 'description' | 'displayName'> & {
    expiration?: FrozenExpiration,
}

export type FrozenStandardActionResult = Partial<{
    relevantSlot: BaseEquipment
    attackResult: FrozenModNode
    damageResult: FrozenModNode
    threatResult: FrozenModNode
    critConfirmResult: FrozenModNode
    critDamageResult: FrozenModNode
    damageTakenResult: FrozenModNode
}>

export type FrozenAbilityNode = {
    type: DiscreteTargetGroupPayloadResolution['type'],
    dc?: FrozenModNode,
    save?: FrozenModNode,
    saveType?: DiscreteTargetGroupPayloadResolution['saveType'],
    damage?: FrozenModNode[],
    damageTaken?: FrozenModNode[],
    heal?: FrozenModNode[],
    statusEffect?: FrozenStatus[],
}

export type TimeTravelContext = {
    source: Actor2Snapshot
    to?: Actor2Snapshot[]
}

type TimeTravelKind = | 'fight-start'
    | 'resolve-participants'
    | 'round'
    | 'speed' // people moving, regardless of if they act
    | 'decay-save-succeeded'
    | 'handle-potential-death'
    | 'act-start'
    | 'decay-rounds-elapsed'
    | 'decay-actions-elapsed'
    | 'ability' // what about the ability though?
    | 'standard-action-result' // an attack
    | 'team-victory' // anyActorAlive
    | 'damage-over-time-taken'
    | 'heal-over-time-taken'

export interface TTLogMap {
    'fight-start': {
        input: TimeTravelContext,
        output: {
            kind: 'fight-start',
        } & TimeTravelContext,
    }
    'standard-action-result': {
        input: TimeTravelContext & FinalStandardActionResult & { damageTakenResult?: ModNode },
        output: TimeTravelContext & {
            kind: 'standard-action-result',
            modNodes: FrozenStandardActionResult,
        },
    }
    'team-victory': {
        input: TimeTravelContext & { winner: 'player' | 'enemy' | 'draw' },
        output: TimeTravelContext & { kind: 'team-victory', winner: 'player' | 'enemy' | 'draw' }
    }
    'speed': {
        input: {
            actors: Actor2Snapshot[],
            modNodes: Record<number, ModNode>,
        },
        output: {
            kind: 'speed',
            // but in speed order
            actors: Actor2Snapshot[],
            modNodes: Record<number, FrozenModNode>,
        }
    },
    'act-start': {
        input: {
            source: Actor2Snapshot,
        },
        output: {
            kind: 'act-start'
            source: Actor2Snapshot,
        },
    },
    'damage-over-time-taken': {
        input: {
            statusSource: StatusEffect,
            modNode: ModNode,
            to: Actor2Snapshot[],
        },
        output: {
            kind: 'damage-over-time-taken',
            statusSource: StatusEffect,
            modNode: FrozenModNode,
            to: Actor2Snapshot[],
        },
    },
    'heal-over-time-taken': {
        input: {
            statusSource: StatusEffect,
            modNode: ModNode,
            to: Actor2Snapshot[],
        },
        output: {
            kind: 'heal-over-time-taken',
            statusSource: StatusEffect,
            modNode: FrozenModNode,
            to: Actor2Snapshot[],
        },
    },
    'ability': {
        input: TimeTravelContext & {
            resolution: DiscreteTargetGroupPayloadResolution,
            damageTaken?: ModNode[],
        },
        output: TimeTravelContext & {
            kind: 'ability',
        } & FrozenAbilityNode
    }
}

export type TTLogKeys = keyof TTLogMap

/* type Handler = <T extends TTLogKeys>(kind: T, input: TTLogMap[T]['input']) => TTLogMap[T]['output'] */

export type Handlers = {
    [K in TTLogKeys]: (
        input: TTLogMap[K]['input']
    ) => TTLogMap[K]['output']
}