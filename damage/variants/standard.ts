import { ContextNames } from "../../contexts"
import calculateBaseMod from "../../attack/base-mod"
import calculateFeatMod from "../../attack/feat-mod"
import { RollModifierFuncFactory, RollModifierRequiredData } from "../../roll-modifier/types"

export const standardDamageModifierFactory: RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => {
    return () => {
        const { characterSheet, equipmentSheet, featSheet } = data

        const BASE_CONTEXT = [] as ContextNames[]

        const bm = calculateBaseMod(characterSheet.str)
        const fm = calculateFeatMod({
            characterSheet,
            equipmentSheet,
            featSheet,
        }, [
            ...BASE_CONTEXT,
        ], 'damage')

        return bm + fm
    }
}

export default standardDamageModifierFactory
