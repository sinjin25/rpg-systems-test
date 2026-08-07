import { Feat2 } from ".."
import { leaf } from "../../log2"

const displayName = 'Improved Initiative'
const improvedInitiative = {
    displayName,
    broadContexts: {
        'initiative-feat-mod': () => leaf(displayName, 4)
    }
} as const satisfies Feat2

export default improvedInitiative