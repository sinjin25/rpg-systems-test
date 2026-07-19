import { createEquipment } from "../../equipment-sheet";
import roll from "../../roll";

export const clawSmall = createEquipment({
    displayName: 'claw (small)',
    contexts: ['melee', 'natural'],
    damage: () => roll(6) // a neg to hit reduces damage so early enemies need a slightly higher roll to balance having a low to hit mod while still doing damage
})

export const naturalAc = (amnt: number) => {
    return createEquipment({
        displayName: 'claw (small)',
        contexts: ['natural'],
        ac: amnt
    })
}