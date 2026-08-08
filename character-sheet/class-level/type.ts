import { Ability } from "../../ability-sheet2"
import { Feat2, FeatSheet } from "../../feat2"
import { PossibleFeatKey } from "../../feat2/feats"

export type ClassLevelMember = {
    feats: FeatSheet,
    abilities?: Ability[],
    attackBonus: number,
    fortitudeSave: number,
    reflexSave: number,
    // will save (int)
    selectBonusFeat?: boolean,
}

export type ClassLevels = {
    displayName: string,
    data: Array<ClassLevelMember>,
    level: number, // when counting shit, functions will read up to this index
}

// an arbitrary list of the levels a user has
export type ClassLevelLog = Array<
    {
        registryKey: string, // 'fighter'
        level: 0, // slice indexes for CLassLevels['data']
        picks: {
            feats: PossibleFeatKey[],
        }
    }
>