import { StatusSheet } from ".";
import { OwnerMaximal } from "../actor2";
import save from "../log2/terminal/save";
import roll from "../roll";

export type DecayOwner = {
    ss: StatusSheet,
}

export const expireStatus = (owner: DecayOwner, key: string) => {
    const status = owner.ss[key]
    if (!status) return
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

// technically, it should run a handler for maximum flexibility
export const decaySaveSucceeded = (owner: OwnerMaximal) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!status.expiration) continue
        if (status.expiration.kind !== 'save-succeeded') continue

        const { saveType, dc } = status.expiration
        const saveMod = save(saveType)(owner)
        const natural = roll(20)
        const total = natural + saveMod.total()

        if (natural === 1) continue
        if (natural === 20 || total >= dc) expireStatus(owner, key)
    }
}

export const decayEnemyKilled = (
    owners: DecayOwner[],
    killed: { health: { curr: number } },
) => {
    for (const owner of owners) {
        for (const key of Object.keys(owner.ss)) {
            const status = owner.ss[key]
            if (!status.expiration) continue
            if (status.expiration.kind !== 'enemy-killed') continue
            if (status.expiration.enemy === killed) expireStatus(owner, key)
        }
    }
}

export const expireStatusesAfterFight = (
    owner: DecayOwner
) => {
    const keys = Object.keys(owner.ss)
    for (let key of keys) {
        const v = owner.ss[key]
        if (!v.persists) continue
        if (!v.persists.afterBattle) continue
        expireStatus(owner, key)
    }
}