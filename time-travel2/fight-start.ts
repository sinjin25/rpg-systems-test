import { Handlers } from "./types";

const fightStart: Handlers['fight-start'] = (input) => {
    const { source, to, playerIds } = input
    return {
        kind: 'fight-start',
        source,
        to,
        playerIds,
    }
}

export default fightStart