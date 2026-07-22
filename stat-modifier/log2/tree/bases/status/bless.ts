import { leaf } from "../../../";
import { StatusEffectMaximal } from "../../types";

const mod = 2

// bless is a status DEFINITION, not an always-on tree node. It only contributes when it actually lives
// in owner.ss - attack-status-mod discovers it there via collectStatusContributions. +2 to attack rolls,
// unconditional (ported from status-sheet/statuses/bless.ts, whose legacy attack context always applied).
const bless: StatusEffectMaximal = {
    displayName: 'Bless',
    broadContexts: {
        'attack-status-mod': () => leaf('Bless', mod),
    },
}

export default bless
