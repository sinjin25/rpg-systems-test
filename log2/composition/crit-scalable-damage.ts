import newModNode, { sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import damageOfEquipmentPiece from "../bases/damage-of-equipment-piece";
import effectiveDamageStat from "./effective-damage-stat";
import featContribution from "./feat-contribution";
import statusContribution from "./status/status-contribution";

const displayName: EveryTree = 'crit-scalable-damage'
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')

    return newModNode(displayName, [
        damageOfEquipmentPiece(relevantSlot)(owner, opts),
        effectiveDamageStat(owner, opts),
        featContribution('crit-scalable-damage-feat-mod')(owner, opts),
        // generic damage feats (Power Attack) land here so they multiply on a crit
        featContribution('damage-feat-mod')(owner, opts),
        statusContribution('crit-scalable-damage-status-mod')(owner, opts),
    ], sumFunc)
}
