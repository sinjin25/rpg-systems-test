import { ResolvedTick, ResolvedTickCalc, StatusEffect, StatusEffectInstance, StatusExpiration } from "../../status-sheet2/index"
import serializeModNode, { deserializeModNode } from "./mod-node"
import { serializeStatusEffect, deserializeStatusEffect } from "./status-effect"
import type {
    FrozenResolvedTick,
    FrozenResolvedTickCalc,
    FrozenStatusExpiration,
    FrozenStatusEffectInstance,
} from "./types"

const snapshotExpiration = (expiration: StatusExpiration): FrozenStatusExpiration => {
    switch (expiration.kind) {
        case 'save-succeeded':
            return {
                kind: expiration.kind,
                saveType: expiration.saveType,
                dc: serializeModNode(expiration.dc),
            }
        case 'enemy-killed':
            // live reference into another actor's health — not ours to clone here
            return { kind: expiration.kind, enemy: expiration.enemy }
        case 'actions-elapsed':
        case 'rounds-elapsed':
        case 'speed-elapsed':
            return { kind: expiration.kind, remaining: expiration.remaining }
    }
}

const deserializeExpiration = (expiration: FrozenStatusExpiration): StatusExpiration => {
    switch (expiration.kind) {
        case 'save-succeeded':
            return {
                kind: expiration.kind,
                saveType: expiration.saveType,
                dc: deserializeModNode(expiration.dc),
            }
        case 'enemy-killed':
        case 'actions-elapsed':
        case 'rounds-elapsed':
        case 'speed-elapsed':
            return expiration
    }
}

// `base` is a static formula fn off the status definition — shared, not cloned. `mod` is the
// resolved, instance-specific ModNode (frozen at apply time per the TickCalc comment), so it
// does need the real clone.
const snapshotResolvedTickCalc = (calc: ResolvedTickCalc): FrozenResolvedTickCalc => ({
    base: calc.base,
    mod: serializeModNode(calc.mod),
})

const deserializeResolvedTickCalc = (calc: FrozenResolvedTickCalc): ResolvedTickCalc => ({
    base: calc.base,
    mod: deserializeModNode(calc.mod),
})

const snapshotTick = (tick: ResolvedTick): FrozenResolvedTick => ({
    calculateDamage: tick.calculateDamage ? snapshotResolvedTickCalc(tick.calculateDamage) : undefined,
    calculateHeal: tick.calculateHeal ? snapshotResolvedTickCalc(tick.calculateHeal) : undefined,
})

const deserializeTick = (tick: FrozenResolvedTick): ResolvedTick => ({
    calculateDamage: tick.calculateDamage ? deserializeResolvedTickCalc(tick.calculateDamage) : undefined,
    calculateHeal: tick.calculateHeal ? deserializeResolvedTickCalc(tick.calculateHeal) : undefined,
})

export const snapshotStatusEffectInstance = (inst: StatusEffectInstance): FrozenStatusEffectInstance => ({
    // `source` is often the very owner this status sits on (a self-buff) — deep-cloning it
    // here would recurse into snapshotOwner -> snapshotStatusSheet -> this fn -> snapshotOwner
    // forever. Share it by reference, same treatment as cs/fs/es below.
    source: inst.source,
    expiration: inst.expiration ? snapshotExpiration(inst.expiration) : undefined,
    pointer: serializeStatusEffect(inst.pointer),
    tick: inst.tick ? snapshotTick(inst.tick) : undefined,
})

// fallback is used for a consumer's own status catalog (ex rpg-content's statuses/registry)
// whose live registry differs from the one here you should rarely need to do this
export const deserializeStatusEffectInstance = (
    inst: FrozenStatusEffectInstance,
    fallback?: Record<string, StatusEffect>,
): StatusEffectInstance => ({
    source: inst.source,
    expiration: inst.expiration ? deserializeExpiration(inst.expiration) : undefined,
    pointer: deserializeStatusEffect(inst.pointer, fallback),
    tick: inst.tick ? deserializeTick(inst.tick) : undefined,
})

export const snapshotStatusSheet = (ss: Record<string, StatusEffectInstance[]>): Record<string, FrozenStatusEffectInstance[]> => {
    const clone: Record<string, FrozenStatusEffectInstance[]> = {}
    for (const key in ss) {
        clone[key] = ss[key]!.map(snapshotStatusEffectInstance)
    }
    return clone
}

export const deserializeStatusSheet = (
    ss: Record<string, FrozenStatusEffectInstance[]>,
    fallback?: Record<string, StatusEffect>,
): Record<string, StatusEffectInstance[]> => {
    const clone: Record<string, StatusEffectInstance[]> = {}
    for (const key in ss) {
        clone[key] = ss[key]!.map(inst => deserializeStatusEffectInstance(inst, fallback))
    }
    return clone
}
