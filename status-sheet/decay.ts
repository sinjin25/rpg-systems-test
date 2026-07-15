import { CharacterSheet } from "../character-sheet"
import type { Actor } from "../character/actor"
import { EquipmentSheet } from "../equipment-sheet"
import { FeatSheet } from "../feat"
import { applyHealthDelta } from "../health"
import roll from "../roll"
import { saveModifierFactories, saveSucceeds } from "../save"
import { StatusSheet } from "./types"

export type DecayOwnerData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
}

// deletes an expiring status and, if it declares onExpiration, chains into
// the status it returns (reassigned under the same key)
const expireStatus = (owner: DecayOwnerData, key: string) => {
    const status = owner.ss[key]
    delete owner.ss[key]
    const next = status.onExpiration?.(owner)
    if (next) owner.ss[key] = next
}

// the functional difference of and actions elapsed is that this will happen
// before any of the actors act in a round
// example: flat-footed, if 3 of 4 people are queued to go at the same time, only the 4th person would have flat footed when people attack
export const decaySpeedElapsed = (
    owner: DecayOwnerData,
    elapsed: number,
) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (status.expiration.kind !== 'speed-elapsed') continue
        status.expiration.remaining -= elapsed
        if (status.expiration.remaining <= 0) expireStatus(owner, key)
    }
}

export const decayActionsElapsed = (
    owner: DecayOwnerData,
    actionsTaken: number,
) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (status.expiration.kind !== 'actions-elapsed') continue
        status.expiration.remaining -= actionsTaken
        if (status.expiration.remaining <= 0) expireStatus(owner, key)
    }
}

// decremented once per round (see simulate/index.ts's round loop), for
// durations like "for X rounds" rather than speed-order or action-count based
export const decayRoundsElapsed = (
    owner: DecayOwnerData,
    elapsed: number,
    self?: Actor,
) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (status.expiration.kind !== 'rounds-elapsed') continue

        if (status.expiration.tick && self) {
            applyHealthDelta(self.health, status.expiration.tick(owner))
        }

        status.expiration.remaining -= elapsed
        if (status.expiration.remaining <= 0) expireStatus(owner, key)
    }
}

export const decaySaveSucceeded = (
    owner: DecayOwnerData,
) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (status.expiration.kind !== 'save-succeeded') continue

        const { saveType, dc } = status.expiration
        const saveMod = saveModifierFactories[saveType](owner)()
        const natural = roll(20)
        const total = natural + saveMod.total

        if (saveSucceeds(total, dc, natural)) expireStatus(owner, key)
    }
}

export const decayEnemyKilled = (
    owners: DecayOwnerData[],
    killed: { health: { curr: number } },
) => {
    for (const owner of owners) {
        for (const key of Object.keys(owner.ss)) {
            const status = owner.ss[key]
            if (status.expiration.kind !== 'enemy-killed') continue
            if (status.expiration.enemy === killed) expireStatus(owner, key)
        }
    }
}

// remove a status after fight if it is not intended to persist
// a function afterward will re-add ones that should be re-added at the start of a fight
export const expireStatusesAfterFight = (
    owner: DecayOwnerData,
) => {
    const keys = Object.keys(owner.ss)
    for (let key of keys) {
        const v = owner.ss[key]
        if (!v
            || v.persists === undefined
            || !v.persists.afterBattle) expireStatus(owner, key)
    }
}