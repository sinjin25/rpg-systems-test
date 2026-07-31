import { ObjectWithBroadContexts, OwnerMaximal } from "../log2/types"
import { SaveType } from "../save"

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
    saveType: SaveType,
    dc: number,
}

export type StatusExpirationEnemyKilled = {
    kind: 'enemy-killed',
    // structural, not Actor/Owner, to avoid a circular import between status-sheet and character/actor
    enemy: { health: { curr: number } },
}

export type HealthTickResult = {
    kind: 'heal' | 'damage',
    amount: number,
}

export type TickOwnerData = OwnerMaximal

export type StatusExpirationRoundsElapsed = {
    kind: 'rounds-elapsed',
    remaining: number,
    // ex: for heal over time or damage over time
    // they have access to Owner so feats/status/equipment can affect
    // CURRENTLY WE ASSUME ONLY THIS STATUS TYPE HAS TICKS
    tick?: (data: TickOwnerData) => HealthTickResult,
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

export type StatusEffect = {
    displayName: string,
    description?: string,
    broadContext: ObjectWithBroadContexts['broadContexts']
    expiration: StatusExpiration,
    onExpiration?: (data?: Partial<OwnerMaximal>) => StatusEffect | undefined,
    /* interceptRoll?: InterceptRollFunction, */
    persists?: Partial<StatusPersistTypes>
}

export type StatusSheet = {
    [key: string]: StatusEffect
}