// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc, leaf, productFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../types";
import moddedCsScore from "../composition/modded-cs-score";
import featContribution from "../composition/feat-contribution";
import { getCharacterLevel } from "../../character-sheet/class-level";
import flatHealth from "../composition/flat-health";
import healthPerLevel from "../composition/health-per-level";
import baseHealth from "../bases/base-health";

const BASE = 20
const PER_LEVEL = 10
const displayName: EveryTree = 'maximum-health'
export default (owner: OwnerLog2) => {
    const subproblems: TreeSubproblems = {
        'flat-health': flatHealth(owner),
        'base-health': baseHealth(owner),
        'health-from-levels': newModNode(
            'health-from-levels',
            [
                healthPerLevel(owner),
                leaf('levels', getCharacterLevel(owner.cs))
            ],
            productFunc,
        )
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        sumFunc,
    )
}