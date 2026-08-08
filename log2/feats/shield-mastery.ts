import { leaf } from "..";
import { hasAllTags } from "../tags";
import { AllFeats, ObjectWithBroadContexts } from "../types";

const displayName: AllFeats = 'shield-mastery'

const feat: ObjectWithBroadContexts = {
    displayName,
    broadContexts: {
        'ac-feat-mod': (owner) => hasAllTags(owner.tags, ['shield']) ? leaf(displayName, 1) : undefined,
    },
}

export default feat
