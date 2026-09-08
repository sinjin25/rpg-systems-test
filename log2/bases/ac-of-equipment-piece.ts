import newModNode, { leaf } from "..";
import { BaseEquipment } from "../../equipment-sheet2/types";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";

const broadContext: EveryTree = 'ac-of-equipment'
export default (equipment: BaseEquipment) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    if (!equipment || !equipment.broadContexts[broadContext]) return undefined

    // this never requires an owner to be passed
    // @ts-expect-error
    return equipment.broadContexts[broadContext]()
}
