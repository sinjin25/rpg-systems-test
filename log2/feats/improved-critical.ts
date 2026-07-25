import { leaf } from "..";
import { AllFeats, FeatMaximal } from "../types";

const displayName: AllFeats = 'improved-critical'

const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'crit-threat-range-mod': () => leaf(displayName, -1),
    },
}

export default feat
