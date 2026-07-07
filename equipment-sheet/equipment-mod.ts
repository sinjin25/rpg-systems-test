import { BroadContexts, ContextNames } from "../contexts"
import applyContextMod from "../contexts/apply-context-mod"
import { FeatModRequiredData } from "../feat/core-types"
import { BaseEquipment } from "./index.ts"

export const calculateEquipmentMod = <D extends Partial<FeatModRequiredData>>(
    equipment: BaseEquipment[],
    data: D,
    context: ContextNames[],
    broadContext: BroadContexts,
) => {
    return applyContextMod(
        equipment.flatMap(equip => equip?.generateAdditionalContexts ?? []),
        contextMap => contextMap,
        data,
        context,
        broadContext,
    )
}

export default calculateEquipmentMod
