import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet } from "../equipment-sheet"
import { FeatSheet } from "../feat"
import calculateFeatMod from "../roll-modifier/feat-mod"
import roll from "../roll"
import { calculateStatusMod } from "./status-mod"
import { StatusSheet } from "./types"

// the functional difference of and actions elapsed is that this will happen
// before any of the actors act in a round
// example: flat-footed, if 3 of 4 people are queued to go at the same time, only the 4th person would have flat footed when people attack
export const decaySpeedElapsed = (
    ss: StatusSheet,
    elapsed: number,
) => {
    for (const key of Object.keys(ss)) {
        const status = ss[key]
        if (status.expiration.kind !== 'speed-elapsed') continue
        status.expiration.remaining -= elapsed
        if (status.expiration.remaining <= 0) delete ss[key]
    }
}

export const decayActionsElapsed = (
    ss: StatusSheet,
    actionsTaken: number,
) => {
    for (const key of Object.keys(ss)) {
        const status = ss[key]
        if (status.expiration.kind !== 'actions-elapsed') continue
        status.expiration.remaining -= actionsTaken
        if (status.expiration.remaining <= 0) delete ss[key]
    }
}

export const decaySaveSucceeded = (
    owner: {
        cs: CharacterSheet,
        fs: FeatSheet,
        es: EquipmentSheet,
        ss: StatusSheet,
    },
) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (status.expiration.kind !== 'save-succeeded') continue

        const { saveContext, dc } = status.expiration
        const sm = calculateStatusMod(owner, saveContext, 'save')
        const fm = calculateFeatMod(owner, saveContext, 'save')
        const result = roll(20) + sm.total + fm.total

        if (result >= dc) delete owner.ss[key]
    }
}

export const decayEnemyKilled = (
    owners: { ss: StatusSheet }[],
    killed: { health: { curr: number } },
) => {
    for (const owner of owners) {
        for (const key of Object.keys(owner.ss)) {
            const status = owner.ss[key]
            if (status.expiration.kind !== 'enemy-killed') continue
            if (status.expiration.enemy === killed) delete owner.ss[key]
        }
    }
}
