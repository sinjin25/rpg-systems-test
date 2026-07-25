import { leaf } from "../../../";
import { StatusEffectMaximal } from "../../types";

const mod = 4

// bulls-strength is a status DEFINITION, not an always-on tree node. It only contributes when it
// actually lives in owner.ss - str-from-status discovers it there via collectStatusContributions.
const bullsStrength: StatusEffectMaximal = {
    displayName: 'bulls-strength',
    broadContexts: {
        'str-from-status': (owner) => leaf('bulls-strength', mod),
    },
}

export default bullsStrength
