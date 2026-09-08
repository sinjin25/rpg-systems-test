import { OwnerMaximal } from "../../actor2";
import { BaseEquipment } from "../../equipment-sheet2/types";
import { SLOT_TYPE } from "../../equipment-sheet2/defaults";
import newModNode, { leaf, sumFunc } from "../../log2";
import { OwnerLog2 } from "../../log2/types";
import roll from "../../log2/roll";

export const clawSmall: BaseEquipment = (() => {
    const dn = 'Claw (Small)'
    return {
        displayName: dn,
        acceptableSlots: SLOT_TYPE.weapon,
        broadContexts: {
            damage: (o: OwnerLog2) => {
                const sides = 4
                return newModNode(dn, [roll(sides)(o)], sumFunc)
            }
        },
        tags: ['melee']
    }
})()

export const naturalAc = (amnt: number): BaseEquipment => {
    const displayName = `Natural Armor +${amnt}`
    return {
        displayName: `Natural Armor +${amnt}`,
        acceptableSlots: SLOT_TYPE.armor,
        broadContexts: {
            'ac-of-equipment': () => leaf(displayName, amnt)
        },
    }
}