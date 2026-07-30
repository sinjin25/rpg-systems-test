import { leaf } from "..";
import { hasAllTags } from "../tags";
import { AllFeats, FeatMaximal } from "../types";
import { hasEquipmentTag } from "./gate";

const displayName: AllFeats = 'shield-mastery'

const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'ac-feat-mod': (owner) => hasAllTags(owner.tags, ['shield']) ? leaf(displayName, 1) : undefined,
    },
}

export default feat
