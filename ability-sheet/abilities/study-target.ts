import studiedTargetStatus from "../../status-sheet/statuses/studied-target"
import { Ability } from "../types"

// slayer class feature
// apply status effect, bypass DC rolling
export const studyTarget: Ability = {
    displayName: 'Study Target',
    keyStat: 'dex',
    castType: 'swift',
    contexts: [],
    onUse: () => studiedTargetStatus(),
}

export default studyTarget
