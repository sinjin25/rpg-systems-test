import { Handlers } from "./types";

const actorDeath: Handlers['actor-death'] = (input) => {
    const { source } = input
    return {
        kind: 'actor-death',
        source,
    }
}

export default actorDeath
