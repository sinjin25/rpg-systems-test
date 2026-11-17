import snapshotActor from "./serialize/actor";
import serializeModNode from "./serialize/mod-node";
import { freezeStatusDefinition } from "./snapshot/status";
import { Handlers } from "./types";

const damageOverTimeTaken: Handlers['damage-over-time-taken'] = (input) => {
    const { modNode, statusSource, to } = input
    return {
        kind: 'damage-over-time-taken',
        modNode: serializeModNode(modNode),
        statusSource: freezeStatusDefinition(statusSource),
        to,
    }
}

export default damageOverTimeTaken