import { Handlers } from "./types";

const fightStart: Handlers['fight-start'] = (input) => {
    const { playerIds } = input
    return {
        kind: 'fight-start',
        fightStartCheck: true,
    }
}

export default fightStart