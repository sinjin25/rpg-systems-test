import { Feat2 } from ".."
import { leaf } from "../../log2"
import { hasAllTags, hasAnyTag } from "../../log2/tags"
import { OwnerMaximal } from "../../actor2"
import { OwnerLog2 } from "../../log2/types"

export const testFeatMeleeWeaponFighting: Feat2 = {
    displayName: 'test-feat-melee-weapon-fighting',
    broadContexts: {
        'attack-feat-mod': (owner: OwnerLog2) => hasAnyTag(owner.tags, ['melee'], ['ranged', 'magic']) ? leaf('test-feat-melee-weapon-fighting', 1) : undefined,
        'damage-feat-mod': (owner: OwnerLog2) => hasAnyTag(owner.tags, ['melee'], ['ranged', 'magic']) ? leaf('test-feat-melee-weapon-fighting', 1) : undefined
    },
}