import { AbilityCatalog, AbilitySheet } from "../../ability-sheet2";
import type { Actor2, OwnerMaximal } from "../../actor2";
import { StatusEffect, StatusSheet } from "../../status-sheet2";
import { FrozenStatus } from "../types";
import freezeStatus from "./status";

type SnapshotStatusSheet = Record<string, FrozenStatus[]>

export type Actor2Snapshot = {
    id: number,
} & {
    owner: OwnerMaximalStableReferences & OwnerMaximalUnstableReferences,
} & Pick<Actor2, 'speed' | 'health'>

type OwnerMaximalStableReferences = Pick<OwnerMaximal, 'es' | 'cs' | 'fs'>
type OwnerMaximalUnstableReferences = Pick<OwnerMaximal, /* 'ss' |  */'as' | 'tags'> & {
    ss: SnapshotStatusSheet
}

// structured clone doesn't work on things like functions
// some keys are mixes of stable references (ex: parts of StatusEffect) and key value pairs

const cloneHealth = (health: Actor2['health']) => structuredClone(health)

const cloneSpeed = (speed: Actor2['speed']) => structuredClone(speed)

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
    const clone: SnapshotStatusSheet = {}
    for (let key in ss) {
        clone[key] = ss[key]!.map(freezeStatus)
    }

    return clone
}

const snapshotActor = (actor: Actor2): Actor2Snapshot => {
    return {
        health: cloneHealth(actor.health),
        speed: cloneSpeed(actor.speed),
        id: actor.id,
        owner: {
            // stable
            ...actor.owner,
            // unstable
            as: cloneAbilitySheet(actor.owner.as),
            tags: cloneTags(actor.owner.tags), // DO NOT TRUST DO NOT USE
            ss: cloneStatusSheet(actor.owner.ss),
        }
    }
}

export default snapshotActor
