import { OwnerMaximal } from "../actor2";

export type ExperienceBreakpoints = [50, 150, 300, 600, 1000, 1500, 9999999]

export type Experience = {
    currentXp: number, // for players
    breakpoints: ExperienceBreakpoints, // for leveling
}