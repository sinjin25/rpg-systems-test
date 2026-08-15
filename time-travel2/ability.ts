import { Handlers } from "./types"
import freezeResolution from "./snapshot/ability"

const ability: Handlers['ability'] = (input) => {
    const { resolution, source, to } = input
    const frozen = freezeResolution(resolution)

    return { kind: 'ability', ...frozen, source, to }
}

export default ability
