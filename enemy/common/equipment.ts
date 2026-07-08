import { createEquipment } from "../../equipment-sheet";
import roll from "../../roll";

export const clawSmall = createEquipment({
    displayName: 'claw (small)',
    contexts: ['melee', 'natural'],
    damage: () => roll(4)
})

export const naturalAc = (amnt: number) => {
    return createEquipment({
        displayName: 'claw (small)',
        contexts: ['natural'],
        ac: amnt
    })
}