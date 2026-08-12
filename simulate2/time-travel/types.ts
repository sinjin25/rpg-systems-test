import { AbilityModNode } from "../../ability-sheet2"
import { Actor2 } from "../../actor2"
import { StandardActionResult } from "../../actor2/act"
import { BaseEquipment } from "../../equipment-sheet2/types"
import { StatusEffect } from "../../status-sheet2"
import { DecayKinds } from "../../status-sheet2/decay"
import { Actor2Snapshot } from "./snapshot/actor"

type TimeTravelLogs = TimeTravelLog[]
export type TimeTravelLog =
    | FightStartLog
    | SARLog
    | DecayRoundsElapsedLog
    | ResolveParticipantsLog
    | RoundLog
    | DecaySaveSucceededLog
    | HandlePotentialDeathLog
    | ActStartLog
    | DecayActionsElapsedLog
    | AbilityLog
    | TeamVictoryLog
    | DamageOverTimeLog

type DecayTimeTravelLogKinds = DecayKinds

// if it happens in simulate2, there needs to be a key here
export type TimeTravelLogType = | 'fight-start'
    | DecayTimeTravelLogKinds
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

export type FightStartLog = TimeTravelLogMinimum & {
    kind: 'fight-start',
} // need a snapshot of the actors at the start so we can "go to the start" of a fight

export type SARLog = TimeTravelLogMinimum & {
    kind: 'standard-action-result',
    modNodes: FrozenStandardActionResult,
}

type DecayRoundsElapsedLog = TimeTravelLogMinimum & {
    kind: 'decay-rounds-elapsed',
    source: number, // actorId
    affectedActor: Actor2Snapshot,
}

export type ResolveParticipantsLog = TimeTravelLogMinimum & {
    kind: 'resolve-participants',
}

export type RoundLog = TimeTravelLogMinimum & {
    kind: 'round',
}

export type DecaySaveSucceededLog = TimeTravelLogMinimum & {
    kind: 'decay-save-succeeded',
}

export type HandlePotentialDeathLog = TimeTravelLogMinimum & {
    kind: 'handle-potential-death',
}

export type ActStartLog = TimeTravelLogMinimum & {
    kind: 'act-start',
}

export type DecayActionsElapsedLog = TimeTravelLogMinimum & {
    kind: 'decay-actions-elapsed',
}

export type AbilityLog = TimeTravelLogMinimum & {
    kind: 'ability',
}

export type TeamVictoryLog = TimeTravelLogMinimum & {
    kind: 'team-victory',
    team: 'player' | 'enemy' | 'draw'
}

export type DamageOverTimeLog = TimeTravelLogMinimum & {
    kind: 'damage-over-time',
}

export type FrozenModNode = {
    displayName: string,
    children: FrozenModNode[],
    total: number,
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

/* export type EveryTimeTravelLog = SARLog | DecayRoundsElapsedLog */

export type TimeTravelContext = {
    source: Actor2Snapshot,
    to?: Actor2Snapshot[],
}