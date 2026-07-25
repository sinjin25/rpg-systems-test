import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import baseSaveForClassLevel from "../bases/base-save-for-class-level";

export type SaveType = 'fortitude' | 'reflex'

const displayName: Record<SaveType, EveryTree> = {
    fortitude: 'base-fortitude',
    reflex: 'base-reflex',
}

export default (owner: OwnerMaximal, saveType: SaveType) => {
    const perClass = Object.values(owner.cs.levels).map(cl => baseSaveForClassLevel(cl, saveType))
    return newModNode(displayName[saveType], perClass, sumFunc)
}