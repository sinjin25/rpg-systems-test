import { ContextNames } from "../../contexts"
import { calculateBaseMod } from "../../stat-modifier"
import { namedMod } from "../../stat-modifier/log"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import calculateEquipmentMod from "../../equipment-sheet/equipment-mod"
import { calculateStatusMod } from "../../status-sheet/status-mod"
import { SaveModifierFuncFactory, SaveModifierRequiredData } from "../types"

export const fortitudeSaveModifierFactory: SaveModifierFuncFactory = (
    data: SaveModifierRequiredData,
) => {
    return () => {
        const { cs, es, fs, ss } = data

        // fortitude scales off constitution (the same way finesse scales off dexterity).
        // the 'constitution' tag lets feats/statuses target fortitude specifically.
        const BASE_CONTEXT = ['constitution'] as ContextNames[]
        // saves aren't weapon-tied, so - like ac - the equipment mod spans all equipment
        const allEquipment = Object.values(es)

        const bm = namedMod('con', calculateBaseMod(cs.con))
        const fm = calculateFeatMod({ cs, es, fs }, BASE_CONTEXT, 'save')
        const em = calculateEquipmentMod(allEquipment, { cs, es, fs, ss }, BASE_CONTEXT, 'save')
        const sm = calculateStatusMod({ cs, ss }, BASE_CONTEXT, 'save')

        return {
            total: bm.total + fm.total + em.total + sm.total,
            groups: [
                { displayName: 'base mod', ...bm },
                { displayName: 'feat mod', ...fm },
                { displayName: 'equipment mod', ...em },
                { displayName: 'status mod', ...sm },
            ],
        }
    }
}

export default fortitudeSaveModifierFactory
