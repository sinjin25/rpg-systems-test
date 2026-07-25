import { leaf } from "../..";
import { AllFeats, FeatMaximal } from "../types";
import { hasEquipmentTag } from "./gate";

const displayName: AllFeats = 'heavy-armor-mastery'

// +1 AC while heavy armor is worn.
const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'ac-feat-mod': (owner) => hasEquipmentTag(owner, 'heavyArmor') ? leaf(displayName, 1) : undefined,
    },
}

export default feat
