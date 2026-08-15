import { Handlers } from "./types";

const actStart: Handlers['act-start'] = (input) => {
    const { source } = input
    return {
        kind: 'act-start',
        source,
    }
}

export default actStart