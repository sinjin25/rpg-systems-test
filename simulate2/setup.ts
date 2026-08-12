import { Actor2, instantiateActor, OwnerMaximal } from "../actor2"
import { instantiateSpeed } from "../actor2/instantiate"
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
                // reset ability cursors

                // reinstantiate speed
                const { speed } = instantiateSpeed(a.owner)
                a.owner.speed = speed
            })
        }
    }
}

// 
export const resolveParticipants = (
    participants: Array<OwnerMaximal | Actor2>
) => {
    if (participants.length === 0) return
    const part: Actor2[] = []
    for (let p of participants) {
        if (!participantIsActor(p)) part.push(instantiateActor(p))
        else part.push(p)
    }

    return part
}