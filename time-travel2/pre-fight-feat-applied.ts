import { Handlers } from "./types";

const preFightFeatApplied: Handlers['pre-fight-feat-applied'] = (input) => {
    const { source, featsTriggered } = input
    return {
        kind: 'pre-fight-feat-applied',
        source,
        featsTriggered,
    }
}

export default preFightFeatApplied
