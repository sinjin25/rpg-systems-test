import newModNode from "../..";
import { Armor } from "../../../../equipment-sheet";
import { OwnerMaximal } from "../types";

const maxDexOfEquipmentPiece = (equipment: Armor) => newModNode(
    equipment.displayName,
    [],
    () => equipment.maxDexBonus ?? Infinity
)

export default maxDexOfEquipmentPiece
