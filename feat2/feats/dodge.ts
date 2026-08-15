import { Feat2 } from "..";
import { leaf } from "../../log2";

const displayName = 'Dodge'
export default {
    displayName,
    broadContexts: {
        'ac-feat-mod': () => leaf(displayName, 1)
    }
} as const satisfies Feat2