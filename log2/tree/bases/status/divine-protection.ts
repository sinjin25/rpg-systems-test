import { leaf } from "../../../";
import { StatusEffectMaximal } from "../../types";

// divine-protection is a status DEFINITION. It only contributes when it lives in owner.ss - ac-status-mod
// discovers it there via collectStatusContributions. A flat +acBonus to AC, unconditional (ported from
// status-sheet/statuses/divine-protection.ts, whose legacy ac context used the 'all' whitelist).
//
// A factory, not a const, because acBonus is caller-supplied (rolled once at grant time in legacy). The
// legacy roundsRemaining/expiration is a simulate concern, not a tree one, so it is dropped here.
const divineProtection = (acBonus: number): StatusEffectMaximal => ({
    displayName: 'Divine Protection',
    broadContexts: {
        'ac-status-mod': () => leaf('Divine Protection', acBonus),
    },
})

export default divineProtection
