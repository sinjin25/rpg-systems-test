import { Handlers } from "./types";

const fightStart: Handlers['fight-start'] = ({ source, to, playerIds, seed }) => ({
    kind: 'fight-start',
    source,
    to,
    playerIds,
    seed,
})

export default fightStart