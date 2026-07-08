import { ContextNames } from "../contexts"
import { FeatContext } from "../feat/core-types"

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
    saveContext: ContextNames[],
    dc: number,
}

export type StatusExpirationEnemyKilled = {
    kind: 'enemy-killed',
    // structural, not Actor/Owner, to avoid a circular import between status-sheet and character/actor
    enemy: { health: { curr: number } },
}

export type StatusExpiration =
    | StatusExpirationSpeedElapsed
    | StatusExpirationActionsElapsed
    | StatusExpirationSaveSucceeded
    | StatusExpirationEnemyKilled

// a status effect's buffs/debuffs are Feat-shaped: same whitelist/blacklist-driven
// context system, just with an expiration layered on top
export type StatusEffect = {
    displayName: string,
    description?: string,
    context: FeatContext,
    expiration: StatusExpiration,
}
