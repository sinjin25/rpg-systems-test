import { Feat2 } from ".."
import { leaf } from "../../log2"
import { OwnerMaximal } from "../../log2/types"
import { passesTags, weaponTags } from "./gate"

export const testFeatMeleeWeaponFighting: Feat2 = {
    displayName: 'test-feat-melee-weapon-fighting',
    broadContexts: {
        'attack-feat-mod': (owner: OwnerMaximal) => passesTags(weaponTags(owner), ['melee'], ['magic', 'ranged']) ? leaf('test-feat-melee-weapon-fighting', 1) : undefined,
        'damage-feat-mod': (owner: OwnerMaximal) => passesTags(weaponTags(owner), ['melee'], ['magic', 'ranged']) ? leaf('test-feat-melee-weapon-fighting', 1) : undefined
    },
}