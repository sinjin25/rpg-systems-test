import { StatusSheet } from ".";
import { OwnerMaximal } from "../actor2";

export type DecayOwner = {
    ss: StatusSheet,
}

export const expireStatus = (owner: DecayOwner, key: string) => {
    const status = owner.ss[key]
    delete owner.ss[key]
    const next = status.onExpiration?.(owner)
    if (next) owner.ss[key] = next
}

export const decaySpeedElapsed = (owner: DecayOwner, elapsed: number) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!status.expiration) continue
        if (status.expiration.kind !== 'speed-elapsed') continue
        status.expiration.remaining -= elapsed
        if (status.expiration.remaining <= 0) expireStatus(owner, key)
    }
}

export const decayActionsElapsed = (
    owner: DecayOwner,
    actionsTaken: number,
) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!status.expiration) continue
        if (status.expiration.kind !== 'actions-elapsed') continue
        status.expiration.remaining -= actionsTaken
        if (status.expiration.remaining <= 0) expireStatus(owner, key)
    }
}

export const decayRoundsElapsed = (owner: OwnerMaximal, elapsed: number, self?: OwnerMaximal) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!status.expiration) continue
        if (status.expiration.kind !== 'rounds-elapsed') continue

        if (status.expiration.tick && self) {
            const t = status.expiration.tick(owner)
            if (t.kind === 'heal') {
                throw Error('applyHeal has not been refactored')
                /* applyHeal(self.health, t.amount) */
            }
            else {
                throw Error(`applyDamage  has not been refactored`)
                /* applyDamage(self.health, t.amount) */
            }
        }

        status.expiration.remaining -= elapsed
        if (status.expiration.remaining <= 0) expireStatus(owner, key)
    }
}

export const decaySaveSucceeded = (owner: DecayOwner) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!status.expiration) continue
        if (status.expiration.kind !== 'save-succeeded') continue

        const { saveType, dc } = status.expiration
        const saveMod = saveModifierFactories[saveType](owner)()
        const natural = roll(20)
        const total = natural + saveMod.total

        if (saveSucceeds(total, dc, natural)) expireStatus(owner, key)
    }
}