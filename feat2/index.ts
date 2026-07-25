import { FeatFightStartFunction, FeatPrereqFunction } from "../feat/core-types";
import { FeatMaximal } from "../log2/types";
import { InterceptRollFunction } from "../roll-intercept";
import { TriggerHooks } from "../trigger/core-types";

// broadContexts hooks up to log2 tree calcs
export type Feat2 = FeatMaximal & {
    // replacing from Feat
    // context: FeatContext replaced by broadContexts
    // 
    // from Feat
    description?: string,
    prerequisites?: FeatPrereqFunction,
    onFightStart?: FeatFightStartFunction,
    interceptRoll?: InterceptRollFunction,
    trigger?: TriggerHooks,
    // from Feat, dead
    tags?: string[],
}