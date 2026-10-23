import { BaseEquipment, EquipmentSlot } from "../types";
import { EquipmentBlueprint, EquipmentBlueprintModifier, ModKind } from "./types";
import { getModByRank, getModValueByPerfection, ModPosition } from "./util";
import newModNode, { leaf, ModNode, sumFunc } from "../../log2";
import { EveryTree } from "../../log2/types";

export const MOD_KIND_TO_BROAD_CONTEXT_KEY: Record<Exclude<ModKind, 'roll-damage'>, EveryTree> = {
    ac: 'ac-of-equipment',
    attack: 'attack-equipment-mod',
    health: 'health-equipment-mod',
    fortitude: 'fortitude-equipment-mod',
    will: 'will-equipment-mod',
    reflex: 'reflex-equipment-mod',
    dc: 'spell-dc-from-equipment',
    str: 'str-from-equipment',
    dex: 'dex-from-equipment',
    con: 'con-from-equipment',
    int: 'int-from-equipment',
    'flat-damage': 'flat-damage-equipment-mod',
    'crit-threat-range': 'crit-threat-range-equipment-mod',
    'crit-multiplier': 'crit-multiplier-equipment-mod',
    speed: 'speed-equipment-mod',
    initiative: 'initiative-equipment-mod',
    dr: 'damage-taken-equipment-mod',
}

export const _blueprintModToModNode = (
    slot: EquipmentSlot,
    position: ModPosition,
    mod: EquipmentBlueprintModifier,
): ModNode | undefined => {
    // special roll types (ex: roll-damage), ignore for now
    const ltv = getModByRank(slot, position, mod.kind, mod.rank)
    if (!ltv) return undefined

    const value = getModValueByPerfection(ltv, mod.perfection)
    return leaf(`${mod.kind} T${mod.rank}`, value)
}

const _collectModNodesByKind = (
    slot: EquipmentSlot,
    blueprint: EquipmentBlueprint,
): Partial<Record<ModKind, ModNode[]>> => {
    const nodesByKind: Partial<Record<ModKind, ModNode[]>> = {}

    const addMod = (position: ModPosition, mod: EquipmentBlueprintModifier) => {
        const node = _blueprintModToModNode(slot, position, mod)
        if (!node) return

        nodesByKind[mod.kind] = [...(nodesByKind[mod.kind] ?? []), node]
    }

    blueprint.affix.forEach((mod) => addMod('affix', mod))
    blueprint.suffix.forEach((mod) => addMod('suffix', mod))

    return nodesByKind
}

/*
ex: 
maximum-health 62
    flat-health 30
        health-feat-mod 0
        health-equipment-mod 30
            test ring 30
                health T0 10
                health T0 20
*/
export const blueprintModToModNodeAndMerge = (
    slot: EquipmentSlot,
    blueprint: EquipmentBlueprint,
): Partial<Record<ModKind, ModNode>> => {
    const nodesByKind = _collectModNodesByKind(slot, blueprint)

    const merged: Partial<Record<ModKind, ModNode>> = {}
    for (const [kind, nodes] of Object.entries(nodesByKind) as [ModKind, ModNode[]][]) {
        merged[kind] = nodes.length === 1 ? nodes[0] : newModNode(kind, nodes, sumFunc)
    }

    return merged
}

export const blueprintToBaseEquipment = (
    blueprint: EquipmentBlueprint,
    displayName: string,
): BaseEquipment => {
    const nodesByKind = _collectModNodesByKind(blueprint.slot, blueprint)

    const broadContexts: BaseEquipment['broadContexts'] = {}
    for (const [kind, nodes] of Object.entries(nodesByKind) as [ModKind, ModNode[]][]) {
        // roll-damage has no flat broad-context key — see MOD_KIND_TO_BROAD_CONTEXT_KEY
        if (kind === 'roll-damage') continue

        const key = MOD_KIND_TO_BROAD_CONTEXT_KEY[kind]
        // naming
        // `${broadContextKey} -> ${displayName} -> ${kind} T${rank}...`
        broadContexts[key] = () => newModNode(displayName, nodes, sumFunc)
    }

    return {
        displayName,
        acceptableSlots: [blueprint.slot],
        broadContexts,
    }
}
