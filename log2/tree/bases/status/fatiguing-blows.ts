import { leaf } from "../../../";
import { StatusEffectMaximal } from "../../types";

const mod = -1

// fatiguing-blows is a status DEFINITION. It only contributes when it lives in owner.ss -
// attack-status-mod discovers it there via collectStatusContributions. A flat -1 attack penalty,
// unconditional (ported from status-sheet/statuses/fatiguing-blows.ts, whose legacy attack context
// used allContexts).
const fatiguingBlows: StatusEffectMaximal = {
    displayName: 'Fatiguing Blows',
    broadContexts: {
        'attack-status-mod': () => leaf('Fatiguing Blows', mod),
    },
}

export default fatiguingBlows
