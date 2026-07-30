import newModNode, { leaf } from "../../";
import roll from "../../../roll";
import { ObjectWithBroadContexts } from "../../types";

const displayName = `Defensive Roll`
const defensiveRoll: ObjectWithBroadContexts = {
    displayName,
    broadContexts: {
        'damage-taken-status-mod': () => {
            // does not support sides
            const r = roll(4) * -1
            return leaf(displayName, r)
        },
    },
}

export default defensiveRoll
