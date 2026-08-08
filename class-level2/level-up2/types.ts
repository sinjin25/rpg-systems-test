import { PossibleFeatKey } from "../../feat2/feats";
import { ClassKeys, ClassLevelSumKeys } from "../types";

// adapted from types.ts ClassLevel
export type ClassLevelProposal = {
    [K in ClassLevelSumKeys]: number
} & {
    key: ClassKeys,
    classFeats: PossibleFeatKey[],
    hasFreeFeats: boolean,
}
