import newModNode, { leaf } from "../../../";
import { AllStatusEffects, OwnerMaximal, StatusEffectMaximal } from "../../types";

const displayName: AllStatusEffects = 'flat-footed'

const status: StatusEffectMaximal = {
    displayName,
    broadContexts: {
        'max-dex-of-equipment': (owner: OwnerMaximal) => {
            return newModNode(displayName, [], () => 0)
        }
    },
}

export default status
