import { fatiguingBlowsStatus } from "../../status-sheet/statuses/fatiguing-blows"
import { Feat } from "../core-types"

// test feat: create a status effect on miss
export const featFatiguingBlows: Feat = {
    displayName: 'Fatiguing Blows',
    description: 'Debuffs the enemy when you miss within a certain range',
    context: {},
    trigger: {
        onMiss: () => ({
            kind: 'apply-status',
            recipient: 'target',
            key: 'fatiguingBlows',
            status: fatiguingBlowsStatus(),
        }),
    },
}

export default featFatiguingBlows
