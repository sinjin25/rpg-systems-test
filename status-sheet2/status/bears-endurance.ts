import { leaf } from "../../log2";
import { makeWrapper } from "../instance";

const mod = 4
const displayName = 'bears-endurance'

const bearsEndurance = makeWrapper({
    displayName,
    broadContexts: {
        'con-from-status': (owner) => leaf(displayName, mod),
    },
})

export default bearsEndurance
