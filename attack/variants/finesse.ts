import { Attack, AttackModifierFunc, AttackModifierFuncFactory, AttackModifierRequiredData } from '../types'
import { calculateBaseMod } from '../../stat-modifier'
import { namedMod } from '../../stat-modifier/log'
import calculateFeatMod from '../../roll-modifier/feat-mod'
import { ContextNames } from '../../contexts'
import { calculateWeaponEquipmentMod } from '../../roll-modifier/equipment-mod'
import { extractContextsTags } from '../../equipment-sheet/extract'

export const finesseAttackModifierFactory: AttackModifierFuncFactory = (
    data: AttackModifierRequiredData
) => {
    return () => {
        const {
            characterSheet,
            equipmentSheet,
            featSheet,
            statusSheet,
            weapon,
        } = data

        const BASE_CONTEXT = ['finesse'] as ContextNames[]
        const EQUIPMENT_CONTEXT = extractContextsTags(weapon)

        const bm = namedMod('dex', calculateBaseMod(characterSheet.dex))
        const fm = calculateFeatMod({
            characterSheet,
            equipmentSheet,
            featSheet,
        }, [
            ...[...BASE_CONTEXT, ...EQUIPMENT_CONTEXT],
        ], 'attack')
        const em = calculateWeaponEquipmentMod(data, BASE_CONTEXT, 'attack')

        return {
            total: bm.total + fm.total + em.total,
            groups: [
                { displayName: 'base mod', ...bm },
                { displayName: 'feat mod', ...fm },
                { displayName: 'equipment mod', ...em },
            ],
        }
    }
}

export default finesseAttackModifierFactory