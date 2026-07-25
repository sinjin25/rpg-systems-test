import { leaf } from "../../log2";
import { Feat2 } from "..";

const displayName = 'Armor Training'
export default {
    displayName,
    broadContexts: {
        'max-dex-feat-mod': () => leaf(displayName, 1)
    },
} as Feat2