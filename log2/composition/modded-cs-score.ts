import newModNode, { sumFunc } from "..";
import rawCsScore from "../bases/raw-cs-score";
import { CsScore, EveryTree, OwnerLog2, TreeSubproblems } from "../types";
import modFromEquipment from "./equipment/mod-from-equipment";
import csFromStatus from "./status/cs-from-status";

const displayName = (member: CsScore): EveryTree => `modded-${member}`

export default (member: CsScore) => (owner: OwnerLog2) => {

    const subproblems: TreeSubproblems = {
        [`raw-${member}`]: rawCsScore(member)(owner),
        [`${member}-from-status`]: csFromStatus(member)(owner),
        [`${member}-from-equipment`]: modFromEquipment(`${member}-from-equipment`)(owner)
    }

    return newModNode(displayName(member), Object.values(subproblems), sumFunc)
}