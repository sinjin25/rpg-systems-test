import { BroadContexts, ContextNames } from "../contexts"
import applyContextMod from "../contexts/apply-context-mod"
import { BaseEquipment } from "./index.ts"

export const calculateEquipmentMod = <D>(
    equipment: BaseEquipment[],
    data: D,
    context: ContextNames[],
    broadContext: BroadContexts,
) => {
    return applyContextMod(
        equipment,
        equip => equip?.generateAdditionalContexts,
        data,
        context,
        broadContext,
    )
}

export default calculateEquipmentMod
