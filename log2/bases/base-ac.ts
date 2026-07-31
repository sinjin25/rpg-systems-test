import newModNode from "..";
import { EveryTree, OwnerLog2 } from "../types";

const BASE = 10
const displayName: EveryTree = 'base-ac'

export default (owner: OwnerLog2) => newModNode(
    displayName,
    [],
    () => BASE
)