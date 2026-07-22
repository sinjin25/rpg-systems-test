import { leaf } from "../../../";
import { StatusEffectMaximal } from "../../types";

const mod = -1

// studied-target is a status DEFINITION placed on the DEFENDER. It only contributes when it lives in that
// owner's ss - ac-status-mod discovers it there via collectStatusContributions. A flat -1 to the studied
// creature's own AC ("easier to hit"), unconditional (ported from status-sheet/statuses/studied-target.ts,
// whose legacy ac context used the 'all' whitelist).
//
// NB: the legacy status ALSO carries damageTaken +2. That slice is dropped here - log2 has no damage /
// damageTaken branch yet (same deferral as rage/battle-focus damage). It routes back in once that node exists.
const studiedTarget: StatusEffectMaximal = {
    displayName: 'Studied Target',
    broadContexts: {
        'ac-status-mod': () => leaf('Studied Target', mod),
    },
}

export default studiedTarget
