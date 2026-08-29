// the full attack modifier (before the roll): the effective stat + BAB + the feat/status/equipment
// contributions, all summed. See attack-readme.md for which children are still bridged to legacy.

import newModNode, { sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../types";
import effectiveAttackStat from "../composition/effective-attack-stat";
import baseAttackBonus from "../composition/base-attack-bonus";
import attackStatusMod from "../composition/attack-status-mod";
import attackEquipmentMod from "../composition/attack-equipment-mod";
import featContribution from "../composition/feat-contribution";
import { Tags } from "../tags";

const displayName: EveryTree = 'attack'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const TERMINAL_TAGS: Tags[] = ['standard-attack']

    const slot = opts.relevantSlot ?? owner.es.mainhand
    if (!slot) throw Error('relevant slot was not passed')

    const eqTg = slot.tags ?? []
    const localOpts: ModNodeOpts = { ...opts, tags: [...(opts.tags ?? []), ...eqTg, ...TERMINAL_TAGS] }

    const subproblems: TreeSubproblems = {
        'effective-attack-stat': effectiveAttackStat(owner, localOpts),
        'base-attack-bonus':     baseAttackBonus(owner, localOpts),
        'attack-feat-mod':       featContribution('attack-feat-mod')(owner, localOpts),
        'attack-status-mod':     attackStatusMod(owner, localOpts),
        'attack-equipment-mod':  attackEquipmentMod(owner, localOpts),
    }
    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}
