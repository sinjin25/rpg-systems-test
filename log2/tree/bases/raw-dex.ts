import newModNode from "../..";
import { EveryTree, OwnerMaximal } from "../types";

const displayName: EveryTree = 'raw-dex'
export default (owner: OwnerMaximal) => newModNode(
    displayName,
    [],
    () => owner.cs.dex
)
