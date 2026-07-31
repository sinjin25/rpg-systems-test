import { leaf } from "..";
import { AllFeats, ObjectWithBroadContexts, OwnerMaximal } from "../types";

const displayName: AllFeats = 'crit-focus'

// +4 to confirm a critical hit, unconditional.
const feat: ObjectWithBroadContexts = {
    displayName,
    broadContexts: {
        'crit-confirm-mod': () => leaf(displayName, 4),
    },
}

export default feat
