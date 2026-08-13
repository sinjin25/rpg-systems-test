import { Handlers } from "./types";

const fightStart: Handlers['fight-start'] = (input) => {
    const { source, to } = input
    return {
        kind: 'fight-start',
        source,
        to,
    }
}

export default fightStart