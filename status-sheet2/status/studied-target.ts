import { leaf } from "../../log2";
import { ObjectWithBroadContexts } from "../../log2/types";

const mod = -1

const studiedTarget: ObjectWithBroadContexts = {
    displayName: 'Studied Target',
    broadContexts: {
        'ac-status-mod': () => leaf('Studied Target', mod),
        'damage-taken-status-mod': () => leaf('Studied Target', 1),
    },
}

export default studiedTarget
