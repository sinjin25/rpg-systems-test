import newModNode from "../..";
import { Armor } from "../../../../equipment-sheet";
import { OwnerMaximal } from "../types";

const acOfEquipmentPiece = (equipment: Armor) => newModNode(
    equipment.displayName,
    [],
    () => equipment.ac || 0
)

export default acOfEquipmentPiece