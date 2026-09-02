import newModNode from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";

export const BASE_AC = 2
const displayName: EveryTree = 'base-ac'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => newModNode(
    displayName,
    [],
    () => BASE_AC
)
