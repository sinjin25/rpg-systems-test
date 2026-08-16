import { EveryTree, OwnerLog2 } from "../types";
import modFromEquipment from "./equipment/mod-from-equipment";
import newModNode from "..";

const displayName: EveryTree = 'attack-equipment-mod'

export default (owner: OwnerLog2) => {
    const mainhand = owner.es.mainhand
    if (!mainhand) throw Error('a weapon was required')

    return modFromEquipment(displayName)(owner)
}