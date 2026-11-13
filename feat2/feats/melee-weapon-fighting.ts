import { Feat2 } from "../types";
import { leaf } from "../../log2";
import { hasAnyTag } from "../../log2/tags";

const displayName = 'Melee Weapon Fighting'
export default {
    id: 'meleeWeaponFighting',
    hidden: false,
    displayName,
    broadContexts: {
        'attack-feat-mod': (owner, opts) =>
            hasAnyTag(opts.tags ?? [], ['melee'], ['ranged', 'magic']) ? leaf(displayName, 1) : undefined,
    },
} as const satisfies Feat2
