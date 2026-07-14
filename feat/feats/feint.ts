import { Feat } from "../core-types"
import { feintStatus } from "../../status-sheet/statuses/feint"

// key passed to feintStatus must match this feat's own fs key ('featFeint') -
// applyFightStartFeats grants the status under whatever property name this feat
// is registered as in fs, so the two have to agree
export const featFeint: Feat = {
    displayName: 'Feint',
    description: 'The first time you roll a natural 1 this fight, treat it as a natural 20 instead.',
    context: {},
    onFightStart: () => feintStatus('featFeint'),
}

export default featFeint
