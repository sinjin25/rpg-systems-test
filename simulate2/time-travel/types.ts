import { AbilityModNode } from "../../ability-sheet2"
import { Actor2 } from "../../actor2"
import { StandardActionResult } from "../../actor2/act"
import { BaseEquipment } from "../../equipment-sheet2/types"
import { StatusEffect } from "../../status-sheet2"

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
type TimeTravelLog = SARLog | DecayRoundsElapsedLog

type SARLog = {
    kind: 'sar',
    source: number, // actorId
    target: Actor2Snapshot, // ?
    modNodes: FrozenStandardActionResult,
    affectedActors: Actor2Snapshot[], // probably triggers would be split out from this (ex: cleaving finish)
}

type DecayRoundsElapsedLog = {
    kind: 'decay-rounds-elapsed',
    source: number, // actorId
    affectedActor: Actor2Snapshot,
}

type Actor2Snapshot = {
    // minimum information that can be changed
    // as can change due to pick order index
    id: number,
} & Pick<Actor2, 'health' | 'speed'> & Pick<Actor2['owner'], 'fs' | 'as' | 'ss'>

type FrozenModNode = {
    displayName: string,
    children: FrozenModNode[],
    total: number,
}

const modNodeToFrozenModNode = () => {
    // stub
    // simply take the evaluation of total() and replace it with total for each step
}

type FrozenStandardActionResult = {
    relevantSlot: BaseEquipment;
    attackResult: FrozenModNode;
    damageResult: FrozenModNode;
    threatResult: FrozenModNode;
    critConfirmResult: FrozenModNode;
    critDamageResult: FrozenModNode;
}

type FrozenAbilityModNode = {
    // this cannot be solved until Ability exposes additional information about the process (it only does outcomes, unless it's damage)
    payload: StatusEffect | FrozenModNode;
    target: "ally" | "target" | "self";
}