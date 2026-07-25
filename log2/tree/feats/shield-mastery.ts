import { leaf } from "../..";
import { AllFeats, FeatMaximal } from "../types";
import { hasEquipmentTag } from "./gate";

const displayName: AllFeats = 'shield-mastery'

const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'ac-feat-mod': (owner) => hasEquipmentTag(owner, 'shield') ? leaf(displayName, 1) : undefined,
    },
}

export default feat
