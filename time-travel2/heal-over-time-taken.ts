import serializeModNode from "./serialize/mod-node";
import { serializeStatusEffect } from "./serialize/status-effect";
import { Handlers } from "./types";

const healOverTimeTaken: Handlers['heal-over-time-taken'] = (input) => {
    const { modNode, statusSource, to } = input
    return {
        kind: 'heal-over-time-taken',
        modNode: serializeModNode(modNode),
        statusSource: serializeStatusEffect(statusSource),
        to,
    }
}

export default healOverTimeTaken
