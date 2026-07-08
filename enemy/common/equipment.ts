import { createEquipment } from "../../equipment-sheet";
import roll from "../../roll";

export const clawSmall = createEquipment({
    displayName: 'claw (small)',
    contexts: ['melee', 'natural'],
    damage: () => roll(4)
})