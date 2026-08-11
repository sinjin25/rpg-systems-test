import { AbilityModNode } from "../../ability-sheet2"
import { Actor2 } from "../../actor2"
import { StandardActionResult } from "../../actor2/act"
import { BaseEquipment } from "../../equipment-sheet2/types"
import { StatusEffect } from "../../status-sheet2"
import { DecayKinds } from "../../status-sheet2/decay"
import { Actor2Snapshot } from "./snapshot/actor"

// commented out below is a first attempt, for reference. It is insufficient
/* export type TimeTravelLog = {
    actorStartState: Actor2[]
    actorEndState: Actor2[] // feed into next palyback
    // probably this is insufficient something like finishing cleave would have a hard time being interpretted
    actions: Array<{
        actor: Actor2,
        data: FrozenStandardActionResult | FrozenAbilityModNode,
        // possible to cut down on this if the size gets too large but the complexity is higher
        actorsEndState: Actor2[],
        // I suppose the target could be inferred by who has an endstate different that before the action?
        // might be easier to just explicitly write it?
    }>
} */
type TimeTravelLogs = TimeTravelLog[]
export type TimeTravelLog = SARLog | DecayRoundsElapsedLog

type DecayTimeTravelLogKinds = DecayKinds

// if it happens in simulate2, there needs to be a key here
export type TimeTravelLogType = | DecayTimeTravelLogKinds
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

type TimeTravelLogMinimum = {
    kind: TimeTravelLogType,
    context: TimeTravelContext,
}

export type SARLog = TimeTravelLogMinimum & {
    kind: 'standard-action-result',
    modNodes: FrozenStandardActionResult,
}

type DecayRoundsElapsedLog = TimeTravelLogMinimum & {
    kind: 'decay-rounds-elapsed',
    source: number, // actorId
    affectedActor: Actor2Snapshot,
}

export type FrozenModNode = {
    displayName: string,
    children: FrozenModNode[],
    total: number,
}

const modNodeToFrozenModNode = () => {
    // stub
    // simply take the evaluation of total() and replace it with total for each step
}

export type FrozenStandardActionResult = Partial<{
    relevantSlot: BaseEquipment;
    attackResult: FrozenModNode;
    damageResult: FrozenModNode;
    threatResult: FrozenModNode;
    critConfirmResult: FrozenModNode;
    critDamageResult: FrozenModNode;
}>

type FrozenAbilityModNode = {
    // this cannot be solved until Ability exposes additional information about the process (it only does outcomes, unless it's damage)
    payload: StatusEffect | FrozenModNode;
    target: "ally" | "target" | "self";
}

export type EveryTimeTravelLog = SARLog | DecayRoundsElapsedLog

export type TimeTravelContext = {
    source: Actor2Snapshot,
    to?: Actor2Snapshot[],
}