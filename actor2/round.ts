import { ModNode, sumFunc } from "../log2"
import newModNode from "../log2"
import roll from "../log2/roll"
import speedTerminal from "../log2/terminal/speed"
import { ModNodeOpts } from "../log2/types"
import { decaySpeedElapsed } from "../status-sheet2/decay"
import { Round, RoundResult, Speed } from "./types"

export const DEFAULT_SPEED = 35

export const roundOrderBySpeed = <A extends {
    speed: Speed,
}>(actors: A[]) => {
    const orderBySpeed = actors.sort((a, b) => {
        return b.speed.remainder - a.speed.remainder
    })

    return orderBySpeed
}

export const round = (
    data: Round,
    opts: ModNodeOpts = {},
): RoundResult => {
    const acting: Round['participants'] = []
    const modNodes: Map<number, ModNode> = new Map()

    for (let part of data.participants) {
        if (!part.speed.isAlive) continue

        const node = newModNode(
            'speed roll',
            [speedTerminal(part.owner), roll({ diceSides: 6, diceNumber: 2 })(part.owner, opts)],
            sumFunc,
        )
        const amount = node.total()
        part.speed.remainder += amount
        decaySpeedElapsed(part.owner, amount)
        modNodes.set(part.id, node)

        if (part.speed.remainder >= data.speedSum) {
            part.speed.remainder -= data.speedSum
            acting.push(part)
        }
    }

    return {
        acting: roundOrderBySpeed(acting),
        modNodes,
    }
}
