import { Feat2 } from "../../types"
import { leaf } from "../../../log2"

const displayName = 'Ambush!'
export default {
    id: 'ambush',
    hidden: true,
    displayName,
    description: `Goblins are fast and know how to take an opponent by surprise. This might catch you flat-footed!\n\n+4 initiative`,
    broadContexts: {
        'initiative-feat-mod': () => leaf(displayName, 4)
    }
} as const satisfies Feat2
