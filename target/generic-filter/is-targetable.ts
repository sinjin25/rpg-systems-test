// this is an example of target-filter-by-rules.ts

import { getStatusKey, makeWrapper } from "../../status-sheet2";
import { GenericFilter } from "./types";
export const demoUntargetable = makeWrapper({
    broadContexts: {},
    displayName: 'untargetable',
    description: 'This foe cannot be targeted',
})

const canBeTargeted: GenericFilter = (p) => {
    const hasStatus = p.owner.ss[getStatusKey(demoUntargetable)]
    if (hasStatus === undefined) return true
    return false
}

export default canBeTargeted