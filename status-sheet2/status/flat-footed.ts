import newModNode, { leaf } from "../../log2";
import { AllStatusEffects, ObjectWithBroadContexts } from "../../log2/types";
import { OwnerMaximal } from "../../actor2";
import { StatusEffect } from "..";

const displayName: AllStatusEffects = 'flat-footed'

const status = (duration: number): StatusEffect => {
    return {
        displayName,
        broadContexts: {
            'max-dex-of-equipment': (owner: OwnerMaximal) => {
                return newModNode(displayName, [], () => 0)
            }
        },
        expiration: {
            kind: 'speed-elapsed',
            remaining: duration,
        }
    }
}

export default status
