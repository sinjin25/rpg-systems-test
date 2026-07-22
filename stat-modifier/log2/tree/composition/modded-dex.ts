import newModNode, { sumFunc } from "../..";
import newRawDex from "../bases/raw-dex";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import dexFromStatus from "./status/dex-from-status";

const displayName: EveryTree = 'modded-dex'

const moddedDex = (owner: OwnerMaximal) => {

    const subproblems: TreeSubproblems = {
        'raw-dex': newRawDex(owner),
        'dex-from-status': dexFromStatus(owner),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}

export default moddedDex