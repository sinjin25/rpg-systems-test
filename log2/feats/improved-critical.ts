import { leaf } from "..";
import { AllFeats, ObjectWithBroadContexts } from "../types";

const displayName: AllFeats = 'improved-critical'

const feat: ObjectWithBroadContexts = {
    displayName,
    broadContexts: {
        'crit-threat-range-mod': () => leaf(displayName, -1),
    },
}

export default feat
