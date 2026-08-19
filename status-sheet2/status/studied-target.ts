import { leaf } from "../../log2";
import { makeWrapper } from "../instance";

const mod = -1

const studiedTarget = makeWrapper({
    displayName: 'Studied Target',
    broadContexts: {
        'ac-status-mod': () => leaf('Studied Target', mod),
        'damage-taken-status-mod': () => leaf('Studied Target', 1),
    },
})

export default studiedTarget
