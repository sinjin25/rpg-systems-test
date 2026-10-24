import newModNode, { sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import featContribution from "./feat-contribution";
import modFromEquipment from "./equipment/mod-from-equipment";

const displayName: EveryTree = 'flat-damage'
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) =>
    newModNode(displayName, [
        featContribution('flat-damage-feat-mod')(owner, opts),
        modFromEquipment('flat-damage-equipment-mod')(owner, opts),
    ], sumFunc)
