import newModNode, { sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import modFromEquipment from "./equipment/mod-from-equipment";

const displayName: EveryTree = 'roll-damage'
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) =>
    newModNode(displayName, [
        modFromEquipment('roll-damage-equipment-mod')(owner, opts),
    ], sumFunc)
