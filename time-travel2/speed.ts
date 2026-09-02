import { Handlers, FrozenModNode } from "./types"
import freezeModNodeRecursive from "./snapshot/mod-node"
import { roundOrderBySpeed } from "../actor2/round"
import { Actor2Snapshot } from "./snapshot/actor"

const speed: Handlers['speed'] = (input) => {
    const { actors, modNodes } = input

    const order = roundOrderBySpeed(actors) as Actor2Snapshot[]

    const frozenModNodes: Record<number, FrozenModNode> = {}
    for (const [id, node] of Object.entries(modNodes)) {
        frozenModNodes[Number(id)] = freezeModNodeRecursive(node)
    }

    return { kind: 'speed', actors: order, modNodes: frozenModNodes }
}

export default speed
