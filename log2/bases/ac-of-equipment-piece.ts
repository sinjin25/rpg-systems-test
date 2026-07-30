import newModNode, { leaf } from "..";
import { BaseEquipment } from "../../equipment-sheet2/types";
import { EveryTree, OwnerMaximal } from "../types";

const broadContext: EveryTree = 'ac-of-equipment'
export default (equipment: BaseEquipment) => (owner: OwnerMaximal) => {
    if (!equipment || !equipment.broadContexts[broadContext]) return undefined

    // this never requires an owner to be passed
    // @ts-expect-error
    return equipment.broadContexts[broadContext]()
}