import newModNode from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";

const BASE = 20
const displayName: EveryTree = 'base-health'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => newModNode(
    displayName,
    [],
    () => BASE
)
