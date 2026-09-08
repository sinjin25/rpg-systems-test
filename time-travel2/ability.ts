import { Handlers } from "./types"
import freezeResolution from "./snapshot/ability"

const ability: Handlers['ability'] = (input) => {
    const { resolution, source, to, damageTaken } = input
    const frozen = freezeResolution(resolution, damageTaken)

    return { kind: 'ability', ...frozen, source, to }
}

export default ability
