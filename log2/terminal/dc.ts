// the full attack modifier (before the roll): the effective stat + BAB + the feat/status/equipment
// contributions, all summed. See attack-readme.md for which children are still bridged to legacy.

import newModNode, { sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../types";
import { Tags } from "../tags";
import effectiveSpellStat from "../composition/effective-spell-dc-stat";
import statusContribution from "../composition/status/status-contribution";
import modFromEquipment from "../composition/equipment/mod-from-equipment";
import featContribution from "../composition/feat-contribution";

const displayName: EveryTree = 'dc'

export default (
    payload: {
        baseDc: number,
        tags?: Tags[],
    }
) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const slot = opts.relevantSlot ?? owner.es.mainhand
    if (!slot) throw Error('relevant slot was not passed')

    const localOpts: ModNodeOpts = { ...opts, tags: [...(opts.tags ?? []), ...(payload.tags ?? [])] }

    const subproblems: TreeSubproblems = {
        'effective-spell-dc-stat': effectiveSpellStat(owner, localOpts),
        'spell-dc-feat-mod': featContribution('spell-dc-feat-mod')(owner, localOpts),
        'spell-dc-status-mod': statusContribution('spell-dc-status-mod')(owner, localOpts),
        'spell-dc-from-equipment': modFromEquipment('spell-dc-from-equipment')(owner, localOpts),
        'base-dc': newModNode('base-dc', [], () => payload.baseDc)
    }
    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}
