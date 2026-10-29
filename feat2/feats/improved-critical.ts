import { Feat2 } from "../types";
import { leaf } from "../../log2";

const displayName = 'Improved Critical'
export default {
    displayName,
    broadContexts: {
        'crit-threat-range-mod': () => leaf(displayName, -1),
    },
} as const satisfies Feat2
