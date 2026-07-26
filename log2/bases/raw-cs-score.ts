import newModNode from "..";
import { EveryTree, OwnerMaximal } from "../types";

type Member = 'con' | 'dex' | 'str'
const displayName = (member: Member) => {
    return `raw-${member}`
}
export default (member: Member) => {
    return (owner: OwnerMaximal) => newModNode(
        displayName(member),
        [],
        () => owner.cs[member]
    )
}