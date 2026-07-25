import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import flatDamageFeatMod from "./flat-damage-feat-mod";

const displayName: EveryTree = 'flat-damage'

// The damage that does NOT scale with a crit multiplier: added on AFTER the multiply (e.g. Power
// Attack, precision/sneak, elemental). Only feat mods feed it for now; equipment/status buckets
// break out later. Empty -> 0, so it costs nothing when no flat sources are present.
const flatDamage = (owner: OwnerMaximal) =>
    newModNode(displayName, [flatDamageFeatMod(owner)], sumFunc)

export default flatDamage
