import { BaseEquipment } from ".";
import { ContextNames, EquipmentContextNames } from "../contexts";


export const extractContextsTags = (
    d: BaseEquipment,
) => {
    const output: Array<ContextNames> = []
    if (!d.contexts) return output

    for (let cont of d.contexts) {
        output.push(cont)
    }

    return output
}