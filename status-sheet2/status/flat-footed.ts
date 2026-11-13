import newModNode from "../../log2";
import type { AllStatusEffects } from "../../log2/types";
import type { OwnerMaximal } from "../../actor2/types";
import { makeWrapper } from "../instance";

const displayName: AllStatusEffects = 'flat-footed'

const status = (duration: number) => makeWrapper({
    id: 'flatFooted',
    displayName,
    broadContexts: {
        'max-dex-of-equipment': (owner: OwnerMaximal) => {
            return newModNode(displayName, [], () => 0)
        },
    },
}, {
    expiration: { kind: 'speed-elapsed', remaining: duration },
})

export default status
