import { AbilityCatalog, AbilitySheet } from "../../../ability-sheet2";
import type { Actor2, OwnerMaximal } from "../../../actor2";
import { StatusEffect, StatusSheet } from "../../../status-sheet2";

export type Actor2Snapshot = {
    id: number,
} & {
    owner: OwnerMaximalStableReferences & OwnerMaximalUnstableReferences,
} & Pick<Actor2, 'speed' | 'health'>

type OwnerMaximalStableReferences = Pick<OwnerMaximal, 'es' | 'cs' | 'fs' | 'relevantSlot'>
type OwnerMaximalUnstableReferences = Pick<OwnerMaximal, 'ss' | 'as' | 'relevantSlot' | 'tags'>

// structured clone doesn't work on things like functions
// some keys are mixes of stable references (ex: parts of StatusEffect) and key value pairs

const cloneHealth = (health: Actor2['health']) => structuredClone(health)

const cloneSpeed = (speed: Actor2['speed']) => structuredClone(speed)

const cloneRelevantSlot = (relevantSlot: Actor2['owner']['relevantSlot']) => {
    // this one's tough because we don't actually care what this is (it's only used temporarily for calcs)
    // the reason we don't clone properly is because the handlers on items make this a bitch
    return relevantSlot
}

const cloneTags = (tags: Actor2['owner']['tags']) => {
    return structuredClone(tags) // this is just a sequence of strings
}

const cloneAbilitySheet = (as: Actor2['owner']['as']) => {
    return {
        free: {
            items: {
                ...as.free.items, // contains live references
            },
            priority: [...as.free.priority], // string[] so safe
            index: as.free.index
        },
        standard: {
            items: {
                ...as.standard.items, // contains live references
            },
            priority: [...as.standard.priority], // string[] so safe
            index: as.standard.index
        },
        swift: {
            items: {
                ...as.swift.items, // contains live references
            },
            priority: [...as.swift.priority], // string[] so safe
            index: as.swift.index
        },
    } as AbilitySheet
}

const cloneStatusSheet = (ss: Actor2['owner']['ss']) => {
    // WE CANNOT TELL IF SOMETHING WAS SNAPSHOTTED RIGHT NOW
    const clone: StatusSheet = {}
    for (let key in ss) {
        const v = ss[key]!
        clone[key] = {
            ...v,
            // some of these will be live references, but we only care about freezing some
        }
        if (clone[key].expiration) {
            const exp = v.expiration!
            clone[key].expiration = {
                ...exp,
            }
            if (exp.kind === 'save-succeeded') throw Error('We need to freeze the dc and save')

        }
    }

    return clone
}

const snapshotActor = (id: number) => (actor: Actor2): Actor2Snapshot => {
    return {
        health: cloneHealth(actor.health),
        speed: cloneSpeed(actor.speed),
        id,
        owner: {
            // stable
            ...actor.owner,
            // unstable
            relevantSlot: cloneRelevantSlot(actor.owner.relevantSlot), // DO NOT TRUST DO NOT USE
            as: cloneAbilitySheet(actor.owner.as),
            tags: cloneTags(actor.owner.tags), // DO NOT TRUST DO NOT USE
            ss: cloneStatusSheet(actor.owner.ss),
        }
    }
}

export default snapshotActor