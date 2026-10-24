import { RollInstance } from "../../roll/types";
import { EquipmentSlot } from "../types";
import { EquipmentBlueprintBaseItem, ModKind } from "./types";
import { getBaseItemTblBySlot, getModsBySlot, getModTblBySlot, ModPosition } from "./util";

export const rollPerfection = (
    ri?: RollInstance
) => {
    if (!ri) return Math.floor(
        Math.random() * 101
    )
    return Math.floor(
        ri.roll(101) - 1 // roll has a min of 1
    )
}

export const rollRank = (
    lookup: {
        slot: EquipmentSlot,
        position: ModPosition,
        modName: ModKind,
    },
    ri?: RollInstance,
): number | undefined => {
    const table = getModTblBySlot(lookup.slot, lookup.position, lookup.modName)
    if (table.length === 0) return undefined

    let sum = 0
    const thresholds: number[] = table.map((ltv) => sum += ltv.weight)

    const roll = ri ? ri.roll(sum) : Math.floor(Math.random() * sum) + 1

    for (let rank = 0; rank < thresholds.length; rank++) {
        if (thresholds[rank] >= roll) return rank
    }
    return thresholds.length - 1
}

export const rollMod = (
    lookup: {
        slot: EquipmentSlot,
        position: ModPosition,
    },
    ri?: RollInstance,
): ModKind | undefined => {
    const mods = getModsBySlot(lookup.slot, lookup.position)

    let sum = 0
    const thresholds: { modName: ModKind, threshold: number }[] = []
    for (const [modName, ranks] of Object.entries(mods)) {
        for (const rank of ranks) {
            sum += rank.weight
            thresholds.push({ modName: modName as ModKind, threshold: sum })
        }
    }
    if (sum === 0) return undefined

    const roll = ri ? ri.roll(sum) : Math.floor(Math.random() * sum) + 1

    for (const { modName, threshold } of thresholds) {
        if (threshold >= roll) return modName
    }
    return thresholds[thresholds.length - 1].modName
}

export const rollBaseItem = (
    slot: EquipmentSlot,
    ri?: RollInstance,
): EquipmentBlueprintBaseItem | undefined => {
    const table = getBaseItemTblBySlot(slot)

    let sum = 0
    const thresholds: { name: string, threshold: number }[] = []
    for (const [name, value] of Object.entries(table)) {
        sum += value.weight
        thresholds.push({ name, threshold: sum })
    }
    if (sum === 0) return undefined

    const roll = ri ? ri.roll(sum) : Math.floor(Math.random() * sum) + 1

    const _toBlueprintBaseItem = (name: string): EquipmentBlueprintBaseItem => {
        const { base, implicit, damageDiceSides } = table[name]
        return { name, base, implicit, damageDiceSides }
    }

    // pick first base matching threshold
    for (const { name, threshold } of thresholds) {
        if (threshold >= roll) return _toBlueprintBaseItem(name)
    }
    return _toBlueprintBaseItem(thresholds[thresholds.length - 1].name)
}

export const rollModCount = (
    ri?: RollInstance,
): number => {
    // index is mod count 0-4
    // total weight 1000
    const weights = [500, 200, 150, 100, 50]

    let sum = 0
    const thresholds: number[] = weights.map((weight) => sum += weight)

    const roll = ri ? ri.roll(sum) : Math.floor(Math.random() * sum) + 1

    for (let count = 0; count < thresholds.length; count++) {
        if (thresholds[count] >= roll) return count
    }
    return thresholds.length - 1
}
