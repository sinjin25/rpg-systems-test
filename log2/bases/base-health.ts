import newModNode from "..";
import { EveryTree, OwnerLog2 } from "../types";

const BASE = 20
const displayName: EveryTree = 'base-health'

export default (owner: OwnerLog2) => newModNode(
    displayName,
    [],
    () => BASE
)