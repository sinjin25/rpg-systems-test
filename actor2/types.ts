import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet } from "../equipment-sheet2/types"
import { ModNode } from "../log2"
import { Tags } from "../log2/tags"
import { StatusSheet } from "../status-sheet2"
import { FeatSheet } from "../feat2/types"
import { AbilitySheet } from "../ability-sheet2"
import { Experience } from "../experience/types"

// no better place to put rn
export type RewardIds = | 'weak_goblin'
export type OwnerMaximal = {
    cs: CharacterSheet,
    fs: FeatSheet,
    ss: StatusSheet,
    es: EquipmentSheet,
    tags: Tags[], // starts empty, a terminal tree should mutate it. Use the utility functions from tags.ts
    // not checked:
    as: AbilitySheet,
    experience: Experience, // remove soon
    rewardId?: RewardIds,
}

export type Speed = {
    remainder: number, // speed remaining until action
    isAlive: boolean, // expand to include "stunned" | "dead" etc
}

export type Health = {
    max: number,
    curr: number,
    temporary: number,
}

export type Actor2 = {
    id: number,
    speed: Speed,
    health: Health,
    owner: OwnerMaximal,
}

export type Round = {
    participants: Actor2[],
    speedSum: number, // default 35
}

export type RoundResult = {
    acting: Actor2[],
    modNodes: Map<number, ModNode>,
}
