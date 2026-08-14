import { Actor2 } from "../actor2"
import { GenericFilter } from "./generic-filter/types"

// the target has decided it doesn't want to be targeted
// this is phrased as the inverse of ability-filter-by-intercepts

// ex: see 

const participantShouldBeTargeted = (
    participant: Actor2,
    rules: GenericFilter[],
) => {
    return rules.reduce((acc, rule) => {
        if (acc === false) return false // stop asking further questions
        return rule(participant)
    }, true)
}

export default participantShouldBeTargeted