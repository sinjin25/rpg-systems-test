import { leaf } from "..";
import { AllFeats, ObjectWithBroadContexts } from "../types";

const displayName: AllFeats = 'dodgy'

// +4 AC, unconditional.
const feat: ObjectWithBroadContexts = {
    displayName,
    broadContexts: {
        'ac-feat-mod': () => leaf(displayName, 4),
    },
}

export default feat
