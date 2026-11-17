import type { Actor2 } from "../../actor2/types";
import snapshotActor from "../serialize/actor";
export default (actor: Actor2) => snapshotActor(actor)
