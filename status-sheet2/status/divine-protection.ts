import { leaf } from "../../log2";
import { ObjectWithBroadContexts } from "../../log2/types";
import roll from "../../roll";
import { StatusEffect } from "../types";

const divineProtection = (acBonus = roll(4), duration = roll(4)): StatusEffect => ({
    displayName: 'Divine Protection',
    broadContexts: {
        'ac-status-mod': () => leaf('Divine Protection', acBonus),
    },
    expiration: {
        kind: 'rounds-elapsed',
        remaining: duration
    }
})

export default divineProtection
