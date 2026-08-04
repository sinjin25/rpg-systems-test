// used by rage.ts status to improve the stats
// proof of concept for snapshot statuses
import { Feat2 } from "..";

export const displayName = 'Improved Rage'
export const featImprovedRage: Feat2 = {
    displayName,
    description: 'Improved the bonus provided by rage by 2',
    // see rage.ts
    broadContexts: {},
}

export default featImprovedRage