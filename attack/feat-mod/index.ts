import { BroadContexts, ContextNames } from "../../contexts";
import applyContextMod from "../../contexts/apply-context-mod";
import { FeatSheet } from "../../feat";
import { CharacterSheet } from "../../character-sheet";

export type CalculateFeatModRequiredData = {
    characterSheet: CharacterSheet,
    featSheet: FeatSheet,
    equipmentSheet: {},
}

const calculateFeatMod = (
    data: CalculateFeatModRequiredData,
    context: ContextNames[],
    broadContext: BroadContexts,
) => {
    const allFeats = Object.values(data.featSheet)

    return applyContextMod(
        allFeats,
        feat => feat.context,
        data,
        context,
        broadContext,
    )
}

export default calculateFeatMod