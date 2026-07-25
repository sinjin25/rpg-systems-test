import { leaf } from "../..";
import { AllFeats, FeatMaximal } from "../types";
import { hasEquipmentTag } from "./gate";

const displayName: AllFeats = 'heavy-armor-mastery'

const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'ac-feat-mod': (owner) => hasEquipmentTag(owner, 'heavyArmor') ? leaf(displayName, 1) : undefined,
    },
}

export default feat
