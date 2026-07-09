import { BroadContexts, ContextNames } from "../contexts";
import applyContextMod from "../contexts/apply-context-mod";
import { FeatSheet } from "../feat";
import { CharacterSheet } from "../character-sheet";

export type CalculateFeatModRequiredData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: {},
}

export const calculateFeatMod = (
    data: CalculateFeatModRequiredData,
    context: ContextNames[],
    broadContext: BroadContexts,
) => {
    const allFeats = Object.values(data.fs)

    return applyContextMod(
        allFeats,
        feat => feat.context,
        feat => feat.displayName,
        data,
        context,
        broadContext,
    )
}

export default calculateFeatMod
