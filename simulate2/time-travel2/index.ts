import { Handlers } from "./types";
import fightStart from "./fight-start";
import standardActionResult from "./standard-action-result";
export { default as snapshotActor } from './snapshot/actor'

export const timeTravel: Handlers = {
    "fight-start": fightStart,
    "standard-action-result": standardActionResult,
    // minimal passthrough for now; flesh out alongside the other converters
    "team-victory": (input) => ({ ...input, kind: 'team-victory' }),
}