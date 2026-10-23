import { RollInstance } from "../../roll/types";
import { EquipmentSlot } from "../types";
import { EquipmentBlueprint, EquipmentBlueprintModifier } from "./types";
import { ModPosition } from "./util";
import { rollMod, rollModCount, rollPerfection, rollRank } from "./equipment-roll";

export const rollItem = (
    slot: EquipmentSlot,
    ri?: RollInstance,
): EquipmentBlueprint => {
    const modCount = rollModCount(ri)

    let affixCount = Math.floor(modCount / 2)
    let suffixCount = Math.floor(modCount / 2)
    if (modCount % 2 !== 0) {
        const coinFlip = ri ? ri.roll(2) : Math.floor(Math.random() * 2) + 1
        if (coinFlip === 1) affixCount++
        else suffixCount++
    }

    const rollMods = (position: ModPosition, count: number) => {
        const mods: EquipmentBlueprintModifier[] = []
        for (let i = 0; i < count; i++) {
            const kind = rollMod({ slot, position }, ri)
            if (kind === undefined) continue

            const rank = rollRank({ slot, position, modName: kind }, ri) ?? 0
            const perfection = rollPerfection(ri)
            mods.push({ kind, rank, perfection })
        }
        return mods
    }

    return {
        slot,
        affix: rollMods('affix', affixCount),
        suffix: rollMods('suffix', suffixCount),
    }
}
