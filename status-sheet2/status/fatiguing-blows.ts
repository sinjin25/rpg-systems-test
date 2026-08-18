import { leaf } from "../../log2";
import { makeWrapper } from "../instance";

export const MOD = -1
export const FATIGUING_BLOWS_ROUNDS = 3

const displayName = 'Fatiguing Blows'
const fatiguingBlows = makeWrapper({
    displayName,
    broadContexts: {
        'attack-status-mod': () => leaf(displayName, MOD),
    },
}, {
    expiration: { kind: 'rounds-elapsed', remaining: FATIGUING_BLOWS_ROUNDS },
})

export default fatiguingBlows
