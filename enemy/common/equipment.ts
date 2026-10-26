import { BaseEquipment } from "../../equipment-sheet2/types";
import { EquipmentBlueprint } from "../../equipment-sheet2/factory/types";
import { blueprintToBaseEquipment } from "../../equipment-sheet2/factory/broad-context-adapter";

const clawSmallBlueprint: EquipmentBlueprint = {
    slot: 'mainhand',
    affix: [],
    suffix: [],
    base: {
        name: 'Claw (Small)',
        base: { displayName: 'Claw (Small)', tags: ['melee'] },
        implicit: [],
        damageDiceSides: 4,
    },
}

export const clawSmall: BaseEquipment = blueprintToBaseEquipment(clawSmallBlueprint, 'Claw (Small)')

export const naturalAc = (amnt: number): BaseEquipment => {
    const displayName = `Natural Armor +${amnt}`
    const blueprint: EquipmentBlueprint = {
        slot: 'armor',
        affix: [],
        suffix: [],
        base: {
            name: displayName,
            base: { displayName },
            implicit: [{ kind: 'ac', value: amnt }],
        },
    }
    return blueprintToBaseEquipment(blueprint, displayName)
}
