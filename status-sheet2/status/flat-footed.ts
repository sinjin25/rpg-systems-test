import newModNode, { leaf } from "../../log2";
import { AllStatusEffects, OwnerMaximal, ObjectWithBroadContexts } from "../../log2/types";

const displayName: AllStatusEffects = 'flat-footed'

const status: ObjectWithBroadContexts = {
    displayName,
    broadContexts: {
        'max-dex-of-equipment': (owner: OwnerMaximal) => {
            return newModNode(displayName, [], () => 0)
        }
    },
}

export default status
