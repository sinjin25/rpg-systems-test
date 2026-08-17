import freezeModNodeRecursive from "./snapshot/mod-node";
import { Handlers } from "./types";

const healOverTimeTaken: Handlers['heal-over-time-taken'] = (input) => {
    const { modNode, statusSource, to } = input
    return {
        kind: 'heal-over-time-taken',
        modNode: freezeModNodeRecursive(modNode),
        statusSource,
        to,
    }
}

export default healOverTimeTaken
