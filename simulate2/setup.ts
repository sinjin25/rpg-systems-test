import { instantiateActor } from "../actor2"
import { Actor2, OwnerMaximal } from "../actor2/types"
import { instantiateSpeed } from "../actor2/instantiate"
import { ModNodeOpts } from "../log2/types"
import { participantIsActor } from "./type-guard"

export const resolveParticipants = (
    participants: Array<OwnerMaximal | Actor2>,
    opts: ModNodeOpts = {},
) => {
    const part: Actor2[] = []
    for (let p of participants) {
        if (!participantIsActor(p)) part.push(instantiateActor(p, false, opts))
        else {
            part.push(p)
            // force a speed reroll (prevents an rng leak from map simulation)
            const speed = instantiateSpeed(p.owner, opts)
            p.speed = speed.speed
        }
    }

    return part
}