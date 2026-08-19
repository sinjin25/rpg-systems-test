import { Actor2, OwnerMaximal } from "../actor2";
import newModNode, { ModNode, sumFunc } from "../log2";
import damageOverTimeTaken from "../log2/terminal-composition/damage-over-time-taken";
import healOverTimeTaken from "../log2/terminal-composition/heal-over-time-taken";
import { ResolvedTickCalc, StatusEffect, StatusEffectInstance } from "./types";

type TickInstance = {
    source: StatusEffect
    calculateDamage?: ModNode,
    calculateHeal?: ModNode,
}

// resolveXX is basically for a ResolvedTickCalc we have a handler (because we need to roll sometimes) for a base and a snapshotted mod based on status instance creation time
const resolveDamageNode = (calc: ResolvedTickCalc, receiver: OwnerMaximal): ModNode => {
    const node = newModNode('damage-over-time', [calc.base(), calc.mod], sumFunc)
    return damageOverTimeTaken({ node })(receiver)
}

const resolveHealNode = (calc: ResolvedTickCalc, receiver: OwnerMaximal): ModNode => {
    const node = newModNode('heal-over-time', [calc.base(), calc.mod], sumFunc)
    return healOverTimeTaken({ node })(receiver)
}

export const calculateTick = (instance: StatusEffectInstance, receiver: OwnerMaximal): TickInstance => {
    const t = instance.tick

    const ret: TickInstance = {
        source: instance.pointer,
    }
    if (t?.calculateDamage) ret.calculateDamage = resolveDamageNode(t.calculateDamage, receiver)
    if (t?.calculateHeal) ret.calculateHeal = resolveHealNode(t.calculateHeal, receiver)
    return ret
}

export const calculateDamageTicks = (
    actor: Actor2
) => {
    const ret: {
        source: StatusEffect,
        node: ModNode,
    }[] = []
    for (const instances of Object.values(actor.owner.ss)) {
        for (const inst of instances) {
            const ct = calculateTick(inst, actor.owner)
            if (ct.calculateDamage) ret.push({ node: ct.calculateDamage, source: ct.source })
        }
    }
    return ret
}

export const calculateHealTicks = (
    actor: Actor2
) => {
    const ret: {
        source: StatusEffect,
        node: ModNode,
    }[] = []
    for (const instances of Object.values(actor.owner.ss)) {
        for (const inst of instances) {
            const ct = calculateTick(inst, actor.owner)
            if (ct.calculateHeal) ret.push({ node: ct.calculateHeal, source: ct.source })
        }
    }
    return ret
}
