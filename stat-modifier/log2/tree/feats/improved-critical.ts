import { leaf } from "../..";
import { AllFeats, FeatMaximal } from "../types";

const displayName: AllFeats = 'improved-critical'

// widens a weapon's threat range by 1 (e.g. 20 -> 19-20), regardless of weapon type. Negative widens,
// so this contributes -1. Ports legacy featImprovedCritical (whitelist ['all'] -> unconditional here).
const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'crit-threat-range-mod': () => leaf(displayName, -1),
    },
}

export default feat
