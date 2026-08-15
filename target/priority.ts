// given a completed list of participants who can be targeted, who should be targeted?

import { Actor2 } from "../actor2";
import { TargetPriority } from "./types";

const targetPriority = (
    fullParticipants: Actor2[],
    fullTeam: Actor2[],
    validTargets: Actor2[],
    targetPriority: TargetPriority
): Array<Actor2 | undefined> => {
    if (!targetPriority.override) {
        switch (targetPriority.simple) {
            case 'all':
                return [...validTargets]
            case 'last':
                return [validTargets[validTargets.length - 1]]
            case 'first':
            default:
                return [validTargets[0]]
        }
    }
    return targetPriority.override(fullParticipants, fullTeam, validTargets)
}

export default targetPriority