import { leaf } from "../..";
import { AllFeats, FeatMaximal } from "../types";

const displayName: AllFeats = 'dodgy'

// +4 AC, unconditional.
const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'ac-feat-mod': () => leaf(displayName, 4),
    },
}

export default feat
