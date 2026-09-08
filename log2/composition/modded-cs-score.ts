import newModNode, { sumFunc } from "..";
import rawCsScore from "../bases/raw-cs-score";
import { CsScore, EveryTree, ModNodeOpts, OwnerLog2, TreeSubproblems } from "../types";
import modFromEquipment from "./equipment/mod-from-equipment";
import csFromStatus from "./status/cs-from-status";

const displayName = (member: CsScore): EveryTree => `modded-${member}`

export default (member: CsScore) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {

    const subproblems: TreeSubproblems = {
        [`raw-${member}`]: rawCsScore(member)(owner, opts),
        [`${member}-from-status`]: csFromStatus(member)(owner, opts),
        [`${member}-from-equipment`]: modFromEquipment(`${member}-from-equipment`)(owner, opts)
    }

    return newModNode(displayName(member), Object.values(subproblems), sumFunc)
}
