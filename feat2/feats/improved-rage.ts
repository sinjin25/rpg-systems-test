// used by rage.ts status to improve the stats
import { Feat2 } from "..";

export const displayName = 'Improved Rage'
export const featImprovedRage = {
    displayName,
    description: 'Improved the bonus provided by rage by 2',
    // see rage.ts
    broadContexts: {},
} as const satisfies Feat2

export default featImprovedRage