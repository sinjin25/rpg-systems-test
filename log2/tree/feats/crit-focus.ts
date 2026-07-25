import { leaf } from "../..";
import { AllFeats, FeatMaximal, OwnerMaximal } from "../types";

const displayName: AllFeats = 'crit-focus'

// +4 to confirm a critical hit, unconditional.
const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'crit-confirm-mod': () => leaf(displayName, 4),
    },
}

export default feat
