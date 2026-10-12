// a die's side-count modifier (ex: a feat widening a d6 to a d8)

import { ModNode } from "..";
import { ModNodeOpts, OwnerLog2, RollSidesMod } from "../types";
import featContribution from "../composition/feat-contribution";

// this is for modifying sides
export default (member: RollSidesMod) => (owner: OwnerLog2, opts: ModNodeOpts = {}): ModNode | undefined => {
    const displayName = member
    const subpr = featContribution(displayName)(owner, opts)

    if (subpr === undefined || subpr.total() === 0) return undefined

    return subpr
}