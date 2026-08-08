import { Feat2 } from "../../feat2"
import { leaf } from "../../log2"

export const ambush: Feat2 = {
    displayName: 'Ambush!',
    description: `Goblins are fast and know how to take an opponent by surprise. This might catch you flat-footed!\n\n+4 initiative`,
    broadContexts: {
        'initiative-feat-mod': () => leaf('Ambush!', 4)
    }
}