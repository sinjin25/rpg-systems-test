import newModNode from "../..";
import { Armor } from "../../../equipment-sheet";
import { OwnerMaximal } from "../types";

export default (equipment: Armor) => newModNode(
    equipment.displayName,
    [],
    () => equipment.maxDexBonus ?? Infinity
)