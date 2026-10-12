import snapshotActor from "./snapshot/actor";
import freezeModNodeRecursive from "./snapshot/mod-node";
import { freezeStatusDefinition } from "./snapshot/status";
import { Handlers } from "./types";

const damageOverTimeTaken: Handlers['damage-over-time-taken'] = (input) => {
    const { modNode, statusSource, to } = input
    return {
        kind: 'damage-over-time-taken',
        modNode: freezeModNodeRecursive(modNode),
        statusSource: freezeStatusDefinition(statusSource),
        to,
    }
}

export default damageOverTimeTaken