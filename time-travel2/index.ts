import { Handlers } from "./types";
import fightStart from "./fight-start";
import standardActionResult from "./standard-action-result";
import speed from "./speed";
import actStart from "./act-start";
import teamVictory from "./team-victory";
import damageOverTime from "./damage-over-time-taken";
import ability from "./ability";
export { default as snapshotActor } from './snapshot/actor'

export const timeTravel: Handlers = {
    "fight-start": fightStart,
    "standard-action-result": standardActionResult,
    "speed": speed,
    // minimal passthrough for now; flesh out alongside the other converters
    "team-victory": teamVictory,
    'act-start': actStart,
    'damage-over-time-taken': damageOverTime,
    'ability': ability,
}