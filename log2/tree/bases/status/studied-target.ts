import { leaf } from "../../../";
import { StatusEffectMaximal } from "../../types";

const mod = -1

// studied-target is a status DEFINITION placed on the DEFENDER. It only contributes when it lives in that
// owner's ss - the aggregators discover it there via collectStatusContributions. Two unconditional slices
// (ported from status-sheet/statuses/studied-target.ts, whose legacy contexts used the 'all' whitelist):
// a flat -1 to the studied creature's own AC ("easier to hit"), and +2 to the damage it takes.
const studiedTarget: StatusEffectMaximal = {
    displayName: 'Studied Target',
    broadContexts: {
        'ac-status-mod': () => leaf('Studied Target', mod),
        'damage-taken-status-mod': () => leaf('Studied Target', 2),
    },
}

export default studiedTarget
