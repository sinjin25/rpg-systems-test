import { Feat2 } from "../types";
import { leaf } from "../../log2";

const displayName = 'Dodge'
export default {
    id: 'dodge',
    hidden: false,
    displayName,
    broadContexts: {
        'ac-feat-mod': () => leaf(displayName, 1)
    }
} as const satisfies Feat2