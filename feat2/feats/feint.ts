import { leaf } from "../../log2";
import { Feat2 } from "..";
import feintStatus from "../../status-sheet/statuses/feint";

const displayName = 'Feint'
export default {
    displayName,
    description: 'The first time you roll a natural 1 this fight, treat it as a natural 20 instead.',
    broadContexts: {},
    onFightStart: () => feintStatus('featFeint'),
} as Feat2