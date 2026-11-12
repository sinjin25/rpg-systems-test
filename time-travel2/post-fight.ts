import { Handlers } from "./types";

const postFight: Handlers['post-fight'] = (input) => {
    const { source } = input
    return {
        kind: 'post-fight',
        source,
    }
}

export default postFight
