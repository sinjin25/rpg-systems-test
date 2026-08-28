import newModNode from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";

const BASE = 10
const displayName: EveryTree = 'base-ac'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => newModNode(
    displayName,
    [],
    () => BASE
)
