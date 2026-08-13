import snapshotActor from "./snapshot/actor";
import freezeModNodeRecursive from "./snapshot/mod-node";
import { Handlers } from "./types";

const damageOverTime: Handlers['damage-over-time-taken'] = (input) => {
    const { modNode, statusSource, to } = input
    return {
        kind: 'damage-over-time',
        modNode: freezeModNodeRecursive(modNode),
        statusSource,
        to: to.map(a => snapshotActor(a.id)(a)),
    }
}

export default damageOverTime