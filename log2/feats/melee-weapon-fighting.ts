import { leaf } from "..";
import { hasAllTags, hasAnyTag } from "../tags";
import { AllFeats, FeatMaximal } from "../types";

const displayName: AllFeats = 'melee-weapon-fighting'

const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'attack-feat-mod': (owner) =>
            hasAnyTag(owner.tags, ['melee'], ['ranged', 'magic']) ? leaf(displayName, 1) : undefined,
    },
}

export default feat
