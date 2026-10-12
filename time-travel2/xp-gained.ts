import snapshotActor from "./snapshot/actor";
import freezeModNodeRecursive from "./snapshot/mod-node";
import { Handlers } from "./types";

const xpGained: Handlers['xp-gained'] = (input) => {
    const { source, amount, currentXp, didLevel, kind } = input
    return {
        kind: 'xp-gained',
        amount,
        didLevel,
        source,
    }
}

export default xpGained
