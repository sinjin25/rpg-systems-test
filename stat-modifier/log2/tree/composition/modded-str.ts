import newModNode, { sumFunc } from "../..";
import newRawStr from "../bases/raw-str";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import strFromStatus from "./status/str-from-status";

const displayName: EveryTree = 'modded-str'

const moddedStr = (owner: OwnerMaximal) => {

    const subproblems: TreeSubproblems = {
        'raw-str': newRawStr(owner),
        'str-from-status': strFromStatus(owner),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}

export default moddedStr
