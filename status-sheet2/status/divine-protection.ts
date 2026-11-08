import { leaf } from "../../log2";
import roll from "../../roll";
import { RollInstance } from "../../roll/types";
import { makeWrapper } from "../instance";

const divineProtection = (
    acBonus?: number,
    duration?: number,
    opts: { rollInstance?: RollInstance } = {},
) => {
    const r = opts.rollInstance?.roll ?? roll
    acBonus ??= r(4)
    duration ??= r(4)
    return makeWrapper({
        displayName: 'Divine Protection',
        broadContexts: {
            'ac-status-mod': () => leaf('Divine Protection', acBonus),
        },
    }, {
        expiration: { kind: 'rounds-elapsed', remaining: duration },
    })
}

export default divineProtection
