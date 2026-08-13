import { FinalStandardActionResult } from "../../actor2/act"
import { BaseEquipment } from "../../equipment-sheet2/types"
import { Actor2Snapshot } from "./snapshot/actor"

export type FrozenModNode = {
    displayName: string
    children: FrozenModNode[]
    total: number
}

export type FrozenStandardActionResult = Partial<{
    relevantSlot: BaseEquipment
    attackResult: FrozenModNode
    damageResult: FrozenModNode
    threatResult: FrozenModNode
    critConfirmResult: FrozenModNode
    critDamageResult: FrozenModNode
}>

export type TimeTravelContext = {
    source: Actor2Snapshot
    to?: Actor2Snapshot[]
}

type TimeTravelKind = | 'fight-start'
    | 'resolve-participants'
    | 'round' // ex: people's speed moving
    | 'decay-save-succeeded'
    | 'handle-potential-death'
    | 'act-start'
    | 'decay-rounds-elapsed'
    | 'decay-actions-elapsed'
    | 'ability' // what about the ability though?
    | 'standard-action-result' // an attack
    | 'team-victory' // anyActorAlive
    | 'damage-over-time' // pretty sure this doesn't happen in the simulation rn?

export interface TTLogMap {
    'fight-start': {
        input: TimeTravelContext,
        output: {
            kind: 'fight-start',
        } & TimeTravelContext,
    }
    'standard-action-result': {
        input: TimeTravelContext & FinalStandardActionResult,
        output: TimeTravelContext & {
            kind: 'standard-action-result',
            modNodes: FrozenStandardActionResult,
        },
    }
    'team-victory': {
        input: TimeTravelContext & { winner: 'player' | 'enemy' | 'draw' },
        output: TimeTravelContext & { kind: 'team-victory', winner: 'player' | 'enemy' | 'draw' }
    }
}

export type TTLogKeys = keyof TTLogMap

/* type Handler = <T extends TTLogKeys>(kind: T, input: TTLogMap[T]['input']) => TTLogMap[T]['output'] */

export type Handlers = {
    [K in TTLogKeys]: (
        input: TTLogMap[K]['input']
    ) => TTLogMap[K]['output']
}