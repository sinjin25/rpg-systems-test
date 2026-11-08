import type { Actor2 } from "../../actor2/types"
import { AbilityCatalog } from "../../ability-sheet2/types"
import snapshotOwner, { deserializeOwnerSnapshot } from "./owner"
import type { Actor2Snapshot } from "./types"

const snapshotActor = (actor: Actor2, abilityCatalogFallback?: AbilityCatalog): Actor2Snapshot => ({
    id: actor.id,
    health: { ...actor.health },
    speed: { ...actor.speed },
    owner: snapshotOwner(actor.owner, abilityCatalogFallback),
})

export const deserializeActorSnapshot = (snap: Actor2Snapshot): Actor2 => ({
    ...snap,
    owner: deserializeOwnerSnapshot(snap.owner),
})

export default snapshotActor
