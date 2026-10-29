import { Feat2 } from "../types";
import { leaf } from "../../log2";
import { hasAllTags } from "../../log2/tags";

const displayName = 'Finesse Weapon Fighting'
export default {
    displayName,
    broadContexts: {
        'attack-feat-mod': (owner, opts) =>
            hasAllTags(opts.tags ?? [], ['finesse']) ? leaf(displayName, 1) : undefined,
    },
} as const satisfies Feat2
