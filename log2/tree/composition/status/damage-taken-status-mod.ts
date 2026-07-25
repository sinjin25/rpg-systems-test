import newModNode, { sumFunc } from "../../..";
import { EveryTree, OwnerMaximal } from "../../types";
import { collectStatusContributions } from "../../../collect-status-contributions";

const displayName: EveryTree = 'damage-taken-status-mod'

// Status contribution to incoming damage, from the DEFENDER's perspective: sum every status on owner.ss
// that declares a 'damage-taken-status-mod' contribution (Studied Target +2 makes the studied creature
// take more; a Defensive Roll subtracts a frozen die). A status that doesn't apply returns undefined, so
// it leaves no leaf. Mirrors ac-status-mod.
const damageTakenStatusMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'damage-taken-status-mod'), sumFunc)

export default damageTakenStatusMod
