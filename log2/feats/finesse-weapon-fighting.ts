import { leaf } from "..";
import { hasAllTags } from "../tags";
import { AllFeats, FeatMaximal } from "../types";

const displayName: AllFeats = 'finesse-weapon-fighting'

// +1 attack, but only with a finesse weapon. The producer inspects the weapon's tags itself and
// returns undefined when it doesn't apply, so the aggregator sees no child at all.
const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'attack-feat-mod': (owner) =>
            hasAllTags(owner.tags, ['finesse']) ? leaf(displayName, 1) : undefined
    },
}

export default feat
