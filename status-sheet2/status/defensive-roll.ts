import { leaf } from "../../log2";
import roll from "../../roll";
import { makeWrapper } from "../instance";

const displayName = `Defensive Roll`
const defensiveRoll = makeWrapper({
    displayName,
    broadContexts: {
        'damage-taken-status-mod': () => {
            // does not support sides
            const r = roll(4) * -1
            return leaf(displayName, r)
        },
    },
})

export default defensiveRoll
