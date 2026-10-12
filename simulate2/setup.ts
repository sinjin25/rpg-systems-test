import { Actor2, instantiateActor, OwnerMaximal } from "../actor2"
import { instantiateSpeed } from "../actor2/instantiate"
import { ModNodeOpts } from "../log2/types"
import { participantIsActor } from "./type-guard"

// for things that persist between battles
export const setupWorldState = (
    participants: {
        player: OwnerMaximal,
    }
) => {
    const playerActors = [instantiateActor(participants.player, true)]

    return {
        playerActors,
        playersAfterFight() {
            this.playerActors.forEach(a => {
                // expire statuses
                // apply fight start feats
                // reset ability cursor
            })
        }
    }
}

// 
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