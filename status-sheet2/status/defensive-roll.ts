import newModNode, { leaf } from "../../log2";
import roll from "../../roll";
import { ObjectWithBroadContexts } from "../../log2/types";

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
