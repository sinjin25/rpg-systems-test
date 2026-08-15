import { ObjectWithBroadContexts } from "../log2/types"
import { OwnerMaximal } from "../actor2"
import { ModNode } from "../log2"
import { StatusExpiration, StatusPersistTypes } from "./decay/types"

export type {
    StatusExpirationSpeedElapsed,
    StatusExpirationActionsElapsed,
    StatusExpirationSaveSucceeded,
    StatusExpirationEnemyKilled,
    StatusExpirationRoundsElapsed,
    StatusExpiration,
    StatusPersistTypes,
    DecayOwner,
    DecaySaveSucceededLog,
} from "./decay/types"

export type Tick = {
    calculateDamage?: (target: OwnerMaximal) => ModNode,
    calculateHeal?: (target: OwnerMaximal) => ModNode,
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
