// the max dex from a piece of equipment

import { ModNode } from "..";
import { OwnerLog2, RollSidesMod } from "../types";
import featContribution from "../composition/feat-contribution";

// this is for modifying sides
export default (member: RollSidesMod) => (owner: OwnerLog2): ModNode | undefined => {
    const displayName = member
    const subpr = featContribution(displayName)(owner)

    if (subpr === undefined || subpr.total() === 0) return undefined

    return subpr
}