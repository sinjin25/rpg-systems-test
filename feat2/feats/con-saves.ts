import { Feat2 } from "..";
import { leaf } from "../../log2";

export default {
    displayName: 'Hardy',
    broadContexts: {
        'fortitude-feat-mod': () => leaf('Hardy', 2)
    }
} as const satisfies Feat2