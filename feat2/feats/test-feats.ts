import { Feat2 } from "../types"
import { leaf } from "../../log2"
import { hasAllTags, hasAnyTag } from "../../log2/tags"
import { OwnerMaximal } from "../../actor2/types"
import { OwnerLog2 } from "../../log2/types"

// all this does is confirm that tags can be read by a broadContext
// tbh not that interesting of a test
export const testFeatMeleeWeaponFighting: Feat2 = {
    id: 'testFeatMeleeWeaponFighting',
    hidden: true,
    displayName: 'test-feat-melee-weapon-fighting',
    broadContexts: {
        'attack-feat-mod': (owner: OwnerLog2, opts) => hasAnyTag(opts.tags || [], ['melee'], ['ranged', 'magic']) ? leaf('test-feat-melee-weapon-fighting', 1) : undefined,
        'damage-feat-mod': (owner: OwnerLog2, opts) => hasAnyTag(opts.tags || [], ['melee'], ['ranged', 'magic']) ? leaf('test-feat-melee-weapon-fighting', 1) : undefined
    },
}