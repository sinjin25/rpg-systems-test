import { OwnerMaximal } from "../../actor2";
import { BaseEquipment } from "../../equipment-sheet2/types";
import { SLOT_TYPE } from "../../equipment-sheet2/defaults";
import { leaf } from "../../log2";
import { OwnerLog2 } from "../../log2/types";
import roll from "../../roll";

export const clawSmall: BaseEquipment = (() => {
    const dn = 'Claw (Small)'
    return {
        displayName: dn,
        acceptableSlots: SLOT_TYPE.weapon,
        broadContexts: {
            damage: (o: OwnerLog2) => {
                const sides = 4
                return leaf(dn, roll(sides))
            }
        },
        tags: ['melee']
    }
})()

export const naturalAc = (amnt: number): BaseEquipment => {
    return {
        displayName: `Natural Armor +${amnt}`,
        acceptableSlots: SLOT_TYPE.armor,
        broadContexts: {},
    }
}