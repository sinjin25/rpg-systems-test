import { Handlers } from "./types"
import freezeModNodeRecursive from "./snapshot/mod-node"
import { FrozenStandardActionResult } from "./types"
import { roundOrderBySpeed } from "../actor2/round"
import { Actor2Snapshot } from "./snapshot/actor"

const speed: Handlers['speed'] = (input) => {
    const { actors } = input

    const order = roundOrderBySpeed(actors) as Actor2Snapshot[]
    return { kind: 'speed', actors: order }
}

export default speed
