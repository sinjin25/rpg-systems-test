import { Actor2, OwnerMaximal } from "../actor2";
import { ModNode } from "../log2";
import damageOverTime from "../log2/terminal/damage-over-time";
import healOverTime from "../log2/terminal/heal-over-time";
import damageOverTimeTaken from "../log2/terminal-composition/damage-over-time-taken";
import healOverTimeTaken from "../log2/terminal-composition/heal-over-time-taken";
import { ResolvedTickCalc, StatusEffect, StatusEffectInstance } from "./types";
import { ModNodeOpts } from "../log2/types";

type TickInstance = {
    source: StatusEffect
    calculateDamage?: ModNode,
    calculateHeal?: ModNode,
}

// resolveXX is basically for a ResolvedTickCalc we have a handler (because we need to roll sometimes) for a base and a snapshotted mod based on status instance creation time
const resolveDamageNode = (calc: ResolvedTickCalc, source: OwnerMaximal, receiver: OwnerMaximal, opts: ModNodeOpts): ModNode => {
    const node = damageOverTime(calc.base(opts))(source, opts, calc.mod)
    return damageOverTimeTaken({ node })(receiver)
}

const resolveHealNode = (calc: ResolvedTickCalc, source: OwnerMaximal, receiver: OwnerMaximal, opts: ModNodeOpts): ModNode => {
    const node = healOverTime(calc.base(opts))(source, opts, calc.mod)
    return healOverTimeTaken({ node })(receiver)
}

export const calculateTick = (instance: StatusEffectInstance, receiver: OwnerMaximal, opts: ModNodeOpts = {}): TickInstance => {
    const t = instance.tick

    const ret: TickInstance = {
        source: instance.pointer,
    }
    if (t?.calculateDamage) ret.calculateDamage = resolveDamageNode(t.calculateDamage, instance.source, receiver, opts)
    if (t?.calculateHeal) ret.calculateHeal = resolveHealNode(t.calculateHeal, instance.source, receiver, opts)
    return ret
}

export const calculateDamageTicks = (
    actor: Actor2,
    opts: ModNodeOpts = {}
) => {
    const ret: {
        source: StatusEffect,
        node: ModNode,
    }[] = []
    for (const instances of Object.values(actor.owner.ss)) {
        for (const inst of instances) {
            const ct = calculateTick(inst, actor.owner, opts)
            if (ct.calculateDamage) ret.push({ node: ct.calculateDamage, source: ct.source })
        }
    }
    return ret
}

export const calculateHealTicks = (
    actor: Actor2,
    opts: ModNodeOpts = {}
) => {
    const ret: {
        source: StatusEffect,
        node: ModNode,
    }[] = []
    for (const instances of Object.values(actor.owner.ss)) {
        for (const inst of instances) {
            const ct = calculateTick(inst, actor.owner, opts)
            if (ct.calculateHeal) ret.push({ node: ct.calculateHeal, source: ct.source })
        }
    }
    return ret
}
