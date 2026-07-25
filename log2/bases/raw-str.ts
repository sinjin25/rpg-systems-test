import newModNode from "..";
import { EveryTree, OwnerMaximal } from "../types";

const displayName: EveryTree = 'raw-str'
export default (owner: OwnerMaximal) => newModNode(
    displayName,
    [],
    () => owner.cs.str
)
