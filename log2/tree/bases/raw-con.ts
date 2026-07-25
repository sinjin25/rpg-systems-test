import newModNode from "../..";
import { EveryTree, OwnerMaximal } from "../types";

const displayName: EveryTree = 'raw-con'
export default (owner: OwnerMaximal) => newModNode(
    displayName,
    [],
    () => owner.cs.con
)
