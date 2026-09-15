import { OwnerMaximal } from "../actor2";
import { ModNode } from "../log2";

export type ExperienceBreakpoints = [50, 150, 300, 600, 1000, 1500, 9999999]

export type Experience = {
    baseOnKill: ModNode,
    currentXp: number, // for players
    breakpoints: ExperienceBreakpoints, // for leveling
}