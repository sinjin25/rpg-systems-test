import { leaf } from "../../log2";
import roll from "../../roll";
import { makeWrapper } from "../instance";

const divineProtection = (acBonus = roll(4), duration = roll(4)) => makeWrapper({
    displayName: 'Divine Protection',
    broadContexts: {
        'ac-status-mod': () => leaf('Divine Protection', acBonus),
    },
}, {
    expiration: { kind: 'rounds-elapsed', remaining: duration },
})

export default divineProtection
