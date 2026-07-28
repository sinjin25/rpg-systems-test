// this is an attack roll with the possibility of adding confirm modifiers

import newModNode, { sumFunc } from "..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import attack from "./attack";
import critConfirmMod from "../composition/crit-confirm-mod";
import { mutateOwnerTags, Tags, TerminalTags } from "../tags";

const displayName: EveryTree = 'crit-confirm'

export default (owner: OwnerMaximal) => {
    const TERMINAL_TAGS: TerminalTags[] = ['crit-confirm']
    mutateOwnerTags(owner, ...TERMINAL_TAGS)

    const subproblems: TreeSubproblems = {
        'attack': attack(owner),
        'crit-confirm-mod': critConfirmMod(owner),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}