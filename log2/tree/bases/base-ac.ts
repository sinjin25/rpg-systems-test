import newModNode from "../..";
import { EveryTree, OwnerMaximal } from "../types";

const BASE = 10
const displayName: EveryTree = 'base-ac'

const baseAc = (owner: OwnerMaximal) => newModNode(
    displayName,
    [],
    () => BASE
)

export default baseAc