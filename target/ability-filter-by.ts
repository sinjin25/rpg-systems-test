// an ability determines the conditions for it to target or not target someone

import { Actor2 } from "../actor2";
import { GenericFilter } from "./generic-filter/types";

const abilityCanTarget = (
    participant: Actor2,
    rules: GenericFilter[],
) => {
    return rules.reduce((acc, rule) => {
        if (acc === false) return false // stop asking further questions
        return rule(participant)
    }, true)
}

export default abilityCanTarget