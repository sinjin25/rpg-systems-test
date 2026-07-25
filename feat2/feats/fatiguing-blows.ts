import { leaf } from "../../log2";
import { Feat2 } from "..";
import fatiguingBlowsStatus from "../../status-sheet/statuses/fatiguing-blows";

const displayName = 'Fatiguing Blows'
export default {
    displayName,
    description: 'Debuffs the enemy when you miss within a certain range',
    broadContexts: {},
    trigger: {
        onMiss: () => ({
            kind: 'apply-status',
            recipient: 'target',
            key: 'fatiguingBlows',
            status: fatiguingBlowsStatus(),
        }),
    },
} as Feat2