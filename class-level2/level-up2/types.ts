import { FeatIds } from "../../feat2/types";
import { ClassKeys, ClassLevelSumKeys } from "../types";

// adapted from types.ts ClassLevel
export type ClassLevelProposal = {
    [K in ClassLevelSumKeys]: number
} & {
    key: ClassKeys,
    classFeats: FeatIds[],
    hasFreeFeats: boolean,
}
