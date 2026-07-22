import { EveryTree, OwnerMaximal } from "../types";
import { calculateStatusMod } from "../../../../status-sheet/status-mod";
import { extractContextsTags } from "../../../../equipment-sheet/extract";
import { modResultToNode } from "../../collect-status-contributions";

const displayName: EveryTree = 'attack-status-mod'

// Status contribution to an attack. Same legacy bridge as attack-feat-mod: assemble the weapon tags
// and let calculateStatusMod filter legacy-format statuses by their 'attack' entry. Note the log2
// stat-boost statuses (cats-grace, bulls-strength) have no legacy `.context`, so they're skipped
// here - correct, they affect a stat, not the attack roll.
const attackStatusMod = (owner: OwnerMaximal) => {
    const tags = owner.es.mainhand ? extractContextsTags(owner.es.mainhand) : []
    return modResultToNode(displayName, calculateStatusMod(
        { cs: owner.cs, ss: owner.ss },
        tags,
        'attack',
    ))
}

export default attackStatusMod
