import newModNode, { sumFunc } from "../..";
import { EquipmentMaximal, EveryTree, OwnerMaximal } from "../../types";
import { collectStatusContributions } from "../../collect-status-contributions";
import { Armor } from "../../../equipment-sheet";

const displayName: EveryTree = 'equipment-modded-str'

export default (owner: OwnerMaximal) => {

    type Slots = keyof OwnerMaximal['es']
    const es = owner.es as any
    const equips = es as {
        [K in Slots]: EquipmentMaximal
    }
    const items = Object.values(equips)
        .filter(a => {
            // not needed after full equipment swap
            if (!a.broadContexts) return false
            return !!a.broadContexts[displayName]
        })
        .map(a => a.broadContexts[displayName]!(owner))

    return newModNode(
        displayName,
        items,
        () => sumFunc(items)
    )
}