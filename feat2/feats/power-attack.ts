import { Feat2 } from "..";
import { leaf } from "../../log2";

const displayName = 'Power Attack'
export default {
    displayName,
    broadContexts: {
        'attack-feat-mod': () => leaf(displayName, 2),
        'damage-feat-mod': () => leaf(displayName, 2),
    }
} as const satisfies Feat2