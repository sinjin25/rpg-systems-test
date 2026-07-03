import { BroadContexts, ContextNames, FeatContext, } from "../../feat/feats";
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
    const mod = 0

    const allFeats = Object.entries(data.featSheet)
        .map(f => {
            const [key, value] = f
            return value
        })
    // filter out ones that apply to broad context (attack, save, etc.)
    const appliesToBroadContext = allFeats.filter(feat => {
        return broadContext in feat.context
    })

    // ASSUMES SUM ONLY
    const reducer = appliesToBroadContext.reduce((acc, feat) => {
        // we ensured this exists already (logically) (ts does not know this)
        const broad = feat.context[broadContext] as NonNullable<FeatContext[BroadContexts]>

        // should run the mod function instead of just having mod a number eventually
        const doesApply = broad.applies(context)
        if (doesApply) return acc + broad.mod(data)
        return acc
    }, mod)

    return reducer
}

export default calculateFeatMod