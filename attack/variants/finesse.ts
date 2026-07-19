import { Attack, AttackModifierFunc, AttackModifierFuncFactory, AttackModifierRequiredData } from '../types'
import { calculateBaseMod } from '../../stat-modifier'
import { sumAttackBonusFromClassLevels } from '../../character-sheet/class-level'
import { namedMod } from '../../stat-modifier/log'
import calculateFeatMod from '../../roll-modifier/feat-mod'
import { ContextNames } from '../../contexts'
import { calculateWeaponEquipmentMod } from '../../roll-modifier/equipment-mod'
import { extractContextsTags } from '../../equipment-sheet/extract'
import { calculateStatusMod } from '../../status-sheet/status-mod'

export const finesseAttackModifierFactory: AttackModifierFuncFactory = (
    data: AttackModifierRequiredData
) => {
    return () => {
        const {
            cs,
            es,
            fs,
            ss,
            weapon,
        } = data

        const BASE_CONTEXT = ['finesse'] as ContextNames[]
        const EQUIPMENT_CONTEXT = extractContextsTags(weapon)

        const bm = namedMod('dex', calculateBaseMod(cs.dex))
        const cm = namedMod('Base Attack Bonus', sumAttackBonusFromClassLevels(cs.levels))
        const fm = calculateFeatMod({
            cs,
            es,
            fs,
        }, [
            ...[...BASE_CONTEXT, ...EQUIPMENT_CONTEXT],
        ], 'attack')
        const em = calculateWeaponEquipmentMod(data, BASE_CONTEXT, 'attack')
        const sm = calculateStatusMod({ cs, ss }, [
            ...BASE_CONTEXT,
            ...EQUIPMENT_CONTEXT,
        ], 'attack')

        return {
            total: bm.total + cm.total + fm.total + em.total + sm.total,
            groups: [
                { displayName: 'base mod', ...bm },
                { displayName: 'base attack bonus', ...cm },
                { displayName: 'feat mod', ...fm },
                { displayName: 'equipment mod', ...em },
                { displayName: 'status mod', ...sm },
            ],
        }
    }
}

export default finesseAttackModifierFactory