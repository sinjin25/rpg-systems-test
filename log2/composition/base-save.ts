import { deriveBonus } from "../../class-level2/derive";
import { EveryTree, OwnerLog2 } from "../types";

export type SaveType = 'fortitude' | 'reflex'

const displayName: Record<SaveType, EveryTree> = {
    fortitude: 'base-fortitude',
    reflex: 'base-reflex',
}

export default (owner: OwnerLog2, saveType: SaveType) =>
    deriveBonus(owner.cs.levels, saveType, displayName[saveType])
