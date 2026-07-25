import newModNode, { ModNode, mapFunc, sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import damageTakenStatusMod from "../composition/status/damage-taken-status-mod";
import damageTakenFeatMod from "../composition/damage-taken-feat-mod";

const displayName: EveryTree = 'damage-taken'

export default (defender: OwnerMaximal, incomingDamage: ModNode) => {
    const incoming = newModNode('incoming-damage', [incomingDamage], sumFunc)

    return newModNode(
        displayName,
        [
            incoming,
            damageTakenFeatMod(defender),
            damageTakenStatusMod(defender),
        ],
        mapFunc(v => Math.max(0, v)),
    )
}