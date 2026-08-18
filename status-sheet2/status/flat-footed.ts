import newModNode from "../../log2";
import { AllStatusEffects } from "../../log2/types";
import { OwnerMaximal } from "../../actor2";
import { makeWrapper } from "../instance";

const displayName: AllStatusEffects = 'flat-footed'

const status = (duration: number) => makeWrapper({
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
