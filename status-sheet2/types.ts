import { ObjectWithBroadContexts } from "../log2/types"
import { Actor2, OwnerMaximal } from "../actor2"
import { SaveType } from "../save"
import { ModNode } from "../log2"
import damageOverTime from "../log2/terminal/damage-over-time"
import damageOverTimeTaken from "../log2/terminal-composition/damage-over-time-taken"

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

export type Tick = {
    calculateDamage?: (target: OwnerMaximal) => ModNode,
    calculateHeal?: (target: OwnerMaximal) => ModNode,
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

export type SnapshotStatusEffect = (data: {
    snapshot: OwnerMaximal,
}) => StatusEffect

export type StatusEffect = {
    displayName: string,
    description?: string,
    broadContexts: ObjectWithBroadContexts['broadContexts']
    expiration?: StatusExpiration
    onExpiration?: (data?: Partial<OwnerMaximal>) => StatusEffect | undefined,
    /* interceptRoll?: InterceptRollFunction, */
    persists?: Partial<StatusPersistTypes>
    tick?: Tick
}

export type StatusSheet = Record<string, StatusEffect>