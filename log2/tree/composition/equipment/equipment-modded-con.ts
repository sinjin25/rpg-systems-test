import newModNode, { sumFunc } from "../../..";
import { EquipmentMaximal, EveryTree, OwnerMaximal } from "../../types";

const displayName: EveryTree = 'equipment-modded-con'

// sums every con-affecting piece of equipment found on the runtime equipment sheet. Empty sheet -> no
// children -> 0 (sumFunc is safe on empty children). Mirrors equipment-modded-str/dex.
const calc = (owner: OwnerMaximal) => {

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

export default calc
