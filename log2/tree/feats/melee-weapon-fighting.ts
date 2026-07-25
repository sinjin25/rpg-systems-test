import { leaf } from "../..";
import { AllFeats, FeatMaximal } from "../types";
import { passesTags, weaponTags } from "./gate";

const displayName: AllFeats = 'melee-weapon-fighting'

const feat: FeatMaximal = {
    displayName,
    broadContexts: {
        'attack-feat-mod': (owner) =>
            passesTags(weaponTags(owner), ['melee'], ['ranged', 'magic']) ? leaf(displayName, 1) : undefined,
    },
}

export default feat
