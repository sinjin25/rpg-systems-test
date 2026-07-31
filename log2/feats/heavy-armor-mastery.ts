import { leaf } from "..";
import { hasAllTags } from "../tags";
import { AllFeats, ObjectWithBroadContexts } from "../types";

const displayName: AllFeats = 'heavy-armor-mastery'

const feat: ObjectWithBroadContexts = {
    displayName,
    broadContexts: {
        'ac-feat-mod': (owner) => hasAllTags(owner.tags, ['heavy-armor']) ? leaf(displayName, 1) : undefined,
    },
}

export default feat
