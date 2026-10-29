import { Feat2 } from "../types";
import { leaf } from "../../log2";
import { hasAllTags } from "../../log2/tags";

const displayName = 'Shield Mastery'
export default {
    displayName,
    broadContexts: {
        'ac-feat-mod': (owner, opts) =>
            hasAllTags(opts.tags ?? [], ['shield']) ? leaf(displayName, 1) : undefined,
    },
} as const satisfies Feat2
