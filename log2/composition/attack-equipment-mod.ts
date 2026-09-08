import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import modFromEquipment from "./equipment/mod-from-equipment";

const displayName: EveryTree = 'attack-equipment-mod'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const mainhand = owner.es.mainhand
    if (!mainhand) throw Error('a weapon was required')

    return modFromEquipment(displayName)(owner, opts)
}
