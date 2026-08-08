import { leaf } from "../../log2";
import { ObjectWithBroadContexts } from "../../log2/types";

const mod = 4

// bulls-strength is a status DEFINITION, not an always-on tree node. It only contributes when it
// actually lives in owner.ss - str-from-status discovers it there via collectStatusContributions.
const displayName = 'bears-endurance'
const bearsEndurance: ObjectWithBroadContexts = {
    displayName: displayName,
    broadContexts: {
        'con-from-status': (owner) => leaf(displayName, mod),
    },
}

export default bearsEndurance
