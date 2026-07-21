import { Ability } from "../../ability-sheet"
import { FeatSheet } from "../../feat"
import { Feat } from "../../feat/feats"

export type ClassLevelMember = {
    feats: FeatSheet, // a feature is just a feat but can have ranks I guess?
    abilities?: Ability[],
    attackBonus: number,
    fortitudeSave: number,
    reflexSave: number,
    // will save (int)
    selectBonusFeat?: boolean,
}

// stateful
export type ClassLevels = {
    displayName: string,
    data: Array<ClassLevelMember>,
    level: number,
}

// stateful
export type ClassLevelSheet = Record<string, ClassLevels>