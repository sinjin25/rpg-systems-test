import newModNode, { leaf } from "..";
import { BaseEquipment } from "../../equipment-sheet2/types";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";

const broadContext: EveryTree = 'max-dex-of-equipment'
export default (equipment: BaseEquipment) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const handler = equipment.broadContexts[broadContext]
    if (!handler) return undefined
    return handler(owner, opts)
}
