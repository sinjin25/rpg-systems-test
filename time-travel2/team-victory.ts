import { Handlers } from "./types"
import freezeModNodeRecursive from "./snapshot/mod-node"
import { FrozenStandardActionResult } from "./types"

const teamVictory: Handlers['team-victory'] = (input) => {
    const { source, to, winner } = input
    const context = { source, to }

    return { source, to, kind: 'team-victory', winner }
}

export default teamVictory
