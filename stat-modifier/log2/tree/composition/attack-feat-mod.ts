import { EveryTree, OwnerMaximal } from "../types";
import { calculateFeatMod } from "../../../../roll-modifier/feat-mod";
import { extractContextsTags } from "../../../../equipment-sheet/extract";
import { modResultToNode } from "../../collect-status-contributions";

const displayName: EveryTree = 'attack-feat-mod'

// Feat contribution to an attack. Bridges to the legacy context-tag engine: assemble the tags from
// the faked weapon (mainhand, same fake effective-attack-stat uses) and let calculateFeatMod filter
// every feat by its 'attack' entry. Each applying feat comes back as one entry, which modResultToNode
// turns into a child leaf. Routing lives in the legacy engine on purpose (see DESIGN.md).
const attackFeatMod = (owner: OwnerMaximal) => {
    const tags = owner.es.mainhand ? extractContextsTags(owner.es.mainhand) : []
    return modResultToNode(displayName, calculateFeatMod(
        { cs: owner.cs, es: owner.es, fs: owner.fs },
        tags,
        'attack',
    ))
}

export default attackFeatMod
