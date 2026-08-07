import { Feat2 } from "..";
import { OwnerMaximal } from "../../actor2";
import { rage as rageStatus } from '../../status-sheet2/status/index'

const displayName = 'Rage'
export default {
    displayName,
    description: 'Increase your stats for X rounds',
    broadContexts: {},
    onFightStart: (o: OwnerMaximal) => rageStatus({
        snapshot: o,
    })
} as const satisfies Feat2