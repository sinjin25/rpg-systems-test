import newModNode from "..";
import { CsScore, EveryTree, OwnerMaximal } from "../types";

const displayName = (member: CsScore): EveryTree => {
    return `raw-${member}`
}
export default (member: CsScore) => {
    return (owner: OwnerMaximal) => newModNode(
        displayName(member),
        [],
        () => owner.cs[member]
    )
}