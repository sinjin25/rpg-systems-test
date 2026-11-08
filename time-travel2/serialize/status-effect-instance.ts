import { ResolvedTick, ResolvedTickCalc, StatusEffectInstance, StatusExpiration } from "../../status-sheet2/index"
import snapshotModNode from "./mod-node"

// `pointer` (the shared StatusEffect definition: displayName, onExpiration, broadContexts, ...)
// is a static, shared reference — same object for every instance of that status — so it's
// carried over as-is, same as a map-location entity's onEnter.
const snapshotExpiration = (expiration: StatusExpiration): StatusExpiration => {
    switch (expiration.kind) {
        case 'save-succeeded':
            return {
                kind: expiration.kind,
                saveType: expiration.saveType,
                dc: snapshotModNode(expiration.dc),
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

// `base` is a static formula fn off the status definition — shared, not cloned. `mod` is the
// resolved, instance-specific ModNode (frozen at apply time per the TickCalc comment), so it
// does need the real clone.
const snapshotResolvedTickCalc = (calc: ResolvedTickCalc): ResolvedTickCalc => ({
    base: calc.base,
    mod: snapshotModNode(calc.mod),
})

const snapshotTick = (tick: ResolvedTick): ResolvedTick => ({
    calculateDamage: tick.calculateDamage ? snapshotResolvedTickCalc(tick.calculateDamage) : undefined,
    calculateHeal: tick.calculateHeal ? snapshotResolvedTickCalc(tick.calculateHeal) : undefined,
})

export const snapshotStatusEffectInstance = (inst: StatusEffectInstance): StatusEffectInstance => ({
    // `source` is often the very owner this status sits on (a self-buff) — deep-cloning it
    // here would recurse into snapshotOwner -> snapshotStatusSheet -> this fn -> snapshotOwner
    // forever. Share it by reference, same treatment as cs/fs/es below.
    source: inst.source,
    expiration: inst.expiration ? snapshotExpiration(inst.expiration) : undefined,
    pointer: inst.pointer,
    tick: inst.tick ? snapshotTick(inst.tick) : undefined,
})

export const snapshotStatusSheet = (ss: Record<string, StatusEffectInstance[]>): Record<string, StatusEffectInstance[]> => {
    const clone: Record<string, StatusEffectInstance[]> = {}
    for (const key in ss) {
        clone[key] = ss[key]!.map(snapshotStatusEffectInstance)
    }
    return clone
}
