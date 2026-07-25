import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import flatDamageFeatMod from "./flat-damage-feat-mod";

const displayName: EveryTree = 'flat-damage'
export default (owner: OwnerMaximal) =>
    newModNode(displayName, [flatDamageFeatMod(owner)], sumFunc)