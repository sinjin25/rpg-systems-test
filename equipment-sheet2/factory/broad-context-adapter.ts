import { BaseEquipment, EquipmentSlot } from "../types";
import { EquipmentBlueprint, EquipmentBlueprintModifier, ModKind } from "./types";
import { getModByRank, getModValueByPerfection, ModPosition } from "./util";
import newModNode, { leaf, ModNode, sumFunc } from "../../log2";
import { EveryTree } from "../../log2/types";
import { buildDamageBroadContext, buildRollDamageModBroadContext, collectRollDamageSources } from "./roll-damage";

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

// these replace instead of augment
const IMPLICIT_REPLACE_KEY: Partial<Record<ModKind, EveryTree>> = {
    'crit-threat-range': 'crit-threat-range',
    'crit-multiplier': 'crit-multiplier',
}

export const _blueprintModToModNode = (
    slot: EquipmentSlot,
    position: ModPosition,
    mod: EquipmentBlueprintModifier,
): ModNode | undefined => {
    // handled separately due to it needing to be resolved instead of flat
    // see roll-damage.ts
    if (mod.kind === 'roll-damage') return undefined

    const ltv = getModByRank(slot, position, mod.kind, mod.rank)
    if (!ltv) return undefined

    const value = getModValueByPerfection(ltv, mod.perfection)
    return leaf(`${mod.kind} T${mod.rank}`, value)
}

export type AugmentableModKind = Exclude<ModKind, 'roll-damage'>

const _collectModNodesByKind = (
    slot: EquipmentSlot,
    blueprint: EquipmentBlueprint,
): Partial<Record<ModKind, ModNode[]>> => {
    const nodesByKind: Partial<Record<ModKind, ModNode[]>> = {}

    const relevantSuffix = blueprint.suffix.filter(a => a.kind !== 'roll-damage')
    const relevantAffix = blueprint.affix.filter(a => a.kind !== 'roll-damage')
    const relevantImplicit = (blueprint.base?.implicit ?? []).filter(a => {
        if (a.kind !== 'roll-damage') return false
        // special rules
        if (IMPLICIT_REPLACE_KEY[a.kind] === undefined) return false
        return true
    })

    relevantSuffix.forEach(a => {
        const node = _blueprintModToModNode(slot, 'suffix', a)
        if (!node) return
        if (!nodesByKind[a.kind]) nodesByKind[a.kind] = []

        nodesByKind[a.kind]!.push(node)
    })

    relevantAffix.forEach(a => {
        const node = _blueprintModToModNode(slot, 'affix', a)
        if (!node) return
        if (!nodesByKind[a.kind]) nodesByKind[a.kind] = []

        nodesByKind[a.kind]!.push(node)
    })

    relevantImplicit.forEach(a => {
        // there's no lookup table, just one value so looks different
        const node = leaf(`${a.kind} implicit`, a.value)
        if (!nodesByKind[a.kind]) nodesByKind[a.kind] = []

        nodesByKind[a.kind]!.push(node)
    })

    return nodesByKind
}

export const blueprintToBaseEquipment = (
    blueprint: EquipmentBlueprint,
    displayName: string,
): BaseEquipment => {
    const nodesByKind = _collectModNodesByKind(blueprint.slot, blueprint)

    const broadContexts: BaseEquipment['broadContexts'] = {}

    if (blueprint.base) Object.assign(broadContexts, blueprint.base.base.broadContexts)

    const nodeByKindEntries = Object.entries(nodesByKind) as [AugmentableModKind, ModNode[]][]
    for (const [kind, nodes] of nodeByKindEntries) {
        const key = MOD_KIND_TO_BROAD_CONTEXT_KEY[kind]
        broadContexts[key] = () => newModNode(displayName, nodes, sumFunc)
    }

    // replace value directly (ex: threat)
    const implicit = blueprint.base?.implicit ?? []
    implicit.forEach((mod) => {
        const replaceKey = IMPLICIT_REPLACE_KEY[mod.kind]
        if (!replaceKey) return
        broadContexts[replaceKey] = () => leaf(displayName, mod.value)
    })

    // .damage rolls a dice (this is from implicit)
    // custom handler to roll at runtime
    if (blueprint.base?.damageDiceSides) {
        broadContexts.damage = buildDamageBroadContext(displayName, blueprint.base.damageDiceSides)
    }

    // bonus rolled dice (implicit + affix + suffix) needs a custom handler to roll at runtime
    const rollDamageSources = collectRollDamageSources(blueprint.slot, blueprint)
    if (rollDamageSources.length > 0) {
        broadContexts['roll-damage-equipment-mod'] = buildRollDamageModBroadContext(displayName, rollDamageSources)
    }

    return {
        displayName,
        acceptableSlots: [blueprint.slot],
        broadContexts,
    }
}
