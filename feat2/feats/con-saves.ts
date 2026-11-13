import { Feat2 } from "../types";
import { leaf } from "../../log2";

export default {
    id: 'hardy',
    hidden: false,
    displayName: 'Hardy',
    broadContexts: {
        'fortitude-feat-mod': () => leaf('Hardy', 2)
    }
} as const satisfies Feat2