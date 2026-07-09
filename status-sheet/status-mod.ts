import { BroadContexts, ContextNames } from "../contexts"
import applyContextMod from "../contexts/apply-context-mod"
import { CharacterSheet } from "../character-sheet"
import { StatusSheet } from "./types"

export type CalculateStatusModRequiredData = {
    cs: CharacterSheet,
    ss: StatusSheet,
}

export const calculateStatusMod = (
    data: CalculateStatusModRequiredData,
    context: ContextNames[],
    broadContext: BroadContexts,
) => {
    const allStatuses = Object.values(data.ss)

    return applyContextMod(
        allStatuses,
        status => status.context,
        status => status.displayName,
        data,
        context,
        broadContext,
    )
}

export default calculateStatusMod
