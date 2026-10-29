import { Feat2 } from "../types";
import { leaf } from "../../log2";

const displayName = 'Crit Focus'
export default {
    displayName,
    broadContexts: {
        'crit-confirm-mod': () => leaf(displayName, 4),
    },
} as const satisfies Feat2
