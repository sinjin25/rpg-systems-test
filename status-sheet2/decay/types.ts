import { Saves } from "../../log2/types"
import { ModNode } from "../../log2"
import { StatusEffect, StatusSheet } from "../types"

const decayKinds = ['speed-elapsed', 'actions-elapsed', 'save-succeeded', 'enemy-killed', 'rounds-elapsed',] as const

export type DecayKinds = typeof decayKinds[number]

export type StatusExpirationSpeedElapsed = {
    kind: 'speed-elapsed',
    remaining: number,
}

export type StatusExpirationActionsElapsed = {
    kind: 'actions-elapsed',
    remaining: number,
}

export type StatusExpirationSaveSucceeded = {
    kind: 'save-succeeded',
    // changes which characterSheet vals are used for bonuses
    saveType: Saves,
    dc: ModNode,
}

export type StatusExpirationEnemyKilled = {
    kind: 'enemy-killed',
    enemy: { health: { curr: number } },
}

export type StatusExpirationRoundsElapsed = {
    kind: 'rounds-elapsed',
    remaining: number,
}

export type StatusExpiration =
    | StatusExpirationSpeedElapsed
    | StatusExpirationActionsElapsed
    | StatusExpirationSaveSucceeded
    | StatusExpirationEnemyKilled
    | StatusExpirationRoundsElapsed

export type StatusPersistTypes = {
    afterBattle: boolean,
}

export type DecayOwner = {
    ss: StatusSheet,
}

// technically, it should run a handler for maximum flexibility
export type DecaySaveSucceededLog = {
    key: string, // from getStatusKey
    kind: 'succeeded' | 'failed' // | 'mitigated' etc
    result?: 'expired' | 'replaced'
    dc: ModNode,
    save: ModNode,
}

export type DecayChainStatusLog = {
    key: string,
    kind: 'replaced',
    source: StatusEffect, // where the chain originated from
    // there is no dc or save at this point
    // do we want to pass the new StatusEffect? you can derive it from key
}