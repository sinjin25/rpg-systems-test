import { Actor2 } from "."
import roll from "../roll"
import { decaySpeedElapsed } from "../status-sheet2/decay"

export const DEFAULT_SPEED = 35

// move into terminal/ at some point
export const speedRoll = (
    data: Actor2['owner'], // unused, use later
) => {
    return roll(6) + roll(6)
}

export type Round = {
    participants: Actor2[],
    speedSum: number, // default 35
}

export const roundOrderBySpeed = (actors: Actor2[]) => {
    const orderBySpeed = actors.sort((a, b) => {
        return b.speed.remainder - a.speed.remainder
    })

    return orderBySpeed
}
export const round = (
    data: Round
) => {
    const acting: Round['participants'] = []
    for (let part of data.participants) {
        if (!part.speed.canAct) continue
        // roll
        const roll = speedRoll(part.owner)
        part.speed.remainder += roll
        decaySpeedElapsed(part.owner, roll)
        if (part.speed.remainder >= data.speedSum) {
            part.speed.remainder -= data.speedSum
            acting.push(part)
        }
    }

    // reorder based on excess speed
    return roundOrderBySpeed(acting)
}