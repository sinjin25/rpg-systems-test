import { ContextNames } from "../contexts"
import { FeatContext, FeatModRequiredData } from "../feat/core-types"

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

// decremented once per round, in simulate/index.ts's round loop - unlike speed-elapsed (initiative-order-based) or actions-elapsed (per action taken)
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

// a status effect's buffs/debuffs are Feat-shaped: same whitelist/blacklist-driven
// context system, just with an expiration layered on top
export type StatusEffect = {
    displayName: string,
    description?: string,
    context: FeatContext,
    expiration: StatusExpiration,
    // lets one status chain into another on expiry (e.g. a "charging up" status
    // that turns into the actual buff once its rounds run out)
    onExpiration?: (data?: Partial<FeatModRequiredData>) => StatusEffect | undefined,
    persists?: Partial<StatusPersistTypes>
}
