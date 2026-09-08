import newModNode from "..";
import { CsScore, EveryTree, ModNodeOpts, OwnerLog2 } from "../types";

const displayName = (member: CsScore): EveryTree => {
    return `raw-${member}`
}
export default (member: CsScore) => {
    return (owner: OwnerLog2, opts: ModNodeOpts = {}) => newModNode(
        displayName(member),
        [],
        () => owner.cs[member]
    )
}
