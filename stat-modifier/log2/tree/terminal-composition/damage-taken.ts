import newModNode, { ModNode, mapFunc, sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import damageTakenStatusMod from "../composition/status/damage-taken-status-mod";
import damageTakenFeatMod from "../composition/damage-taken-feat-mod";

const displayName: EveryTree = 'damage-taken'

// The first CROSS-ACTOR terminal. Every other terminal is (owner) => ModNode and solves its whole tree
// from one actor. Damage taken cannot: the incoming number comes from the ATTACKER's tree (a crit-damage
// or damage node built from a different Owner), while the reductions/increases come from the DEFENDER.
// The defender can't recompute the attacker's number, so it is HANDED IN as a finished, sealed ModNode
// (see DESIGN.md "cross-actor values are handed over as fixed, pre-resolved trees").
//
// Sealing: incomingDamage is wrapped, never mutated - we only read its total(). It is trusted as-is.
// Clamp: max(0, ...) so a reduction bigger than the hit can't turn into healing (mirrors legacy
// stat-modifier/damage-taken).
const damageTaken = (defender: OwnerMaximal, incomingDamage: ModNode) => {
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

export default damageTaken
