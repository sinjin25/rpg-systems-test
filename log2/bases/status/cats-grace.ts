import { leaf } from "../../";
import { ObjectWithBroadContexts } from "../../types";

const mod = 4

// cats-grace is now a status DEFINITION, not an always-on tree node. It only contributes when it
// actually lives in owner.ss - dex-from-status discovers it there via collectStatusContributions.
const catsGrace: ObjectWithBroadContexts = {
    displayName: 'cats-grace',
    broadContexts: {
        'dex-from-status': (owner) => leaf('cats-grace', mod),
    },
}

export default catsGrace
