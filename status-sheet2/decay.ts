import { StatusEffect, StatusSheet } from ".";
import { Actor2, OwnerMaximal } from "../actor2";
import { applyDamage } from "../health";
import newModNode, { ModNode, sumFunc } from "../log2";
import roll from "../log2/roll";
import save from "../log2/terminal/save";
import { calculateTick } from "./tick";

export type DecayOwner = {
    ss: StatusSheet,
}

// should be split into two things (expire and add status)
// onExpiration should return a log
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

export const decayRoundsElapsed = (owner: OwnerMaximal, elapsed: number, self?: Actor2) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!status.expiration) continue
        if (status.expiration.kind !== 'rounds-elapsed') continue

        status.expiration.remaining -= elapsed
        if (status.expiration.remaining <= 0) expireStatus(owner, key)
    }
}

// technically, it should run a handler for maximum flexibility
type DecaySaveSucceededLog = {
    key: string,
    kind: 'succeeded' | 'failed' // | 'mitigated' etc
    result?: 'expired' | 'replaced' // | 'mitigated' | 'transformed'
    dc: ModNode,
    save: ModNode,
}
export const decaySaveSucceeded = (owner: OwnerMaximal): DecaySaveSucceededLog[] => {
    const log: DecaySaveSucceededLog[] = []

    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!status.expiration) continue
        if (status.expiration.kind !== 'save-succeeded') continue

        const { saveType, dc } = status.expiration
        const saveMod = save(saveType)(owner)
        const natural = roll(20, 1)(owner)
        const saveTotal = newModNode('save', [saveMod, natural], sumFunc)

        let pass: boolean
        if (natural.total() === 1) pass = false
        else if (natural.total() === 20) pass = true
        else if (saveTotal.total() < dc.total()) pass = false
        else pass = true
        log.push({
            key,
            kind: pass ? 'succeeded' : 'failed',
            dc,
            save: saveTotal,
        })
        if (pass) expireStatus(owner, key)
    }

    return log
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