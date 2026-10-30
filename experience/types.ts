import { OwnerMaximal } from "../actor2";

export type ExperienceBreakpoints = [10, 50, 200, 400, 700, 1000, 9999999]

export type Experience = {
    currentXp: number, // for players
    breakpoints: ExperienceBreakpoints, // for leveling
}