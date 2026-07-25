import newModNode from "..";
import { EveryTree, OwnerMaximal } from "../types";

const BASE = 10
const displayName: EveryTree = 'base-ac'

export default (owner: OwnerMaximal) => newModNode(
    displayName,
    [],
    () => BASE
)