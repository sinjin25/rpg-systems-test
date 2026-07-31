import newModNode, { leaf } from "../../log2";
import { AllStatusEffects, ObjectWithBroadContexts } from "../../log2/types";
import { OwnerMaximal } from "../../actor2";

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
