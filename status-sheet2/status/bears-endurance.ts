import { leaf } from "../../log2";
import { makeWrapper } from "../instance";

const mod = 8
const displayName = 'bears-endurance'

const bearsEndurance = makeWrapper({
    displayName,
    broadContexts: {
        'con-from-status': (owner) => leaf(displayName, mod),
    },
}, {
    expiration: {
        kind: 'rounds-elapsed',
        remaining: 4,
    }
})

export default bearsEndurance
