// this is an attack roll with the possibility of adding confirm modifiers

import newModNode, { sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../types";
import attack from "./attack";
import critConfirmMod from "../composition/crit-confirm-mod";
import { Tags, TerminalTags } from "../tags";

const displayName: EveryTree = 'crit-confirm'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const TERMINAL_TAGS: TerminalTags[] = ['crit-confirm']
    const localOpts: ModNodeOpts = { ...opts, tags: [...(opts.tags ?? []), ...TERMINAL_TAGS] }

    const subproblems: TreeSubproblems = {
        'attack': attack(owner, localOpts),
        'crit-confirm-mod': critConfirmMod(owner, localOpts),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}
