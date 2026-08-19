import { leaf } from "../../log2";
import { makeWrapper } from "../instance";

const mod = 4

const bullsStrength = makeWrapper({
    displayName: 'bulls-strength',
    broadContexts: {
        'str-from-status': (owner) => leaf('bulls-strength', mod),
    },
})

export default bullsStrength
