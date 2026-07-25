import { leaf } from "../..";
import { AllFeats, FeatMaximal } from "../types";
import { passesTags, weaponTags } from "./gate";

const displayName: AllFeats = 'melee-weapon-fighting'

// +1 attack with a melee weapon (not ranged/magic). The legacy feat also gave +1 damage; that half is
// dropped until a damage terminal exists, so this is the attack contribution only.
const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'attack-feat-mod': (owner) =>
            passesTags(weaponTags(owner), ['melee'], ['ranged', 'magic']) ? leaf(displayName, 1) : undefined,
    },
}

export default feat
