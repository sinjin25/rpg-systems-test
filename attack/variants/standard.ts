import { ContextNames } from "../../feat/feats"
import calculateBaseMod from "../base-mod"
import calculateFeatMod from "../feat-mod"
import { AttackModifierFuncFactory, AttackModifierRequiredData } from "../types"

export const standardAttackModifierFactory: AttackModifierFuncFactory = (
    data: AttackModifierRequiredData,
) => {
    return () => {
        const { characterSheet, equipmentSheet, featSheet, statusSheet } = data

        const BASE_CONTEXT = [] as ContextNames[]
        const EQUIPMENT_CONTEXT = [] as ContextNames[]

        const bm = calculateBaseMod(characterSheet.str)
        const fm = calculateFeatMod({
            characterSheet,
            equipmentSheet,
            featSheet,
        }, [
            ...BASE_CONTEXT,
        ], 'attack')

        return bm + fm
    }
}

export default standardAttackModifierFactory