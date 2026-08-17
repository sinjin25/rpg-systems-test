import { Actor2, OwnerMaximal } from "../actor2";
import { applyDamage, applyHeal } from "../health";
import { ModNode } from "../log2";
import { StatusEffect, Tick } from "./types";

type TickInstance = {
    source: StatusEffect
    calculateDamage?: ModNode,
    calculateHeal?: ModNode,
}

export const calculateTick = (status: StatusEffect, receiver: OwnerMaximal): TickInstance => {
    const ret: TickInstance = {
        calculateDamage: undefined,
        calculateHeal: undefined,
        source: status,
    }
    const t = status?.tick
    if (t === undefined) return ret

    if (t.calculateDamage) {
        ret.calculateDamage = t.calculateDamage(receiver)
    }
    if (t.calculateHeal) {
        ret.calculateHeal = t.calculateHeal(receiver)
    }

    return ret
}

export const calculateDamageTicks = (
    actor: Actor2
) => {
    const ret: {
        source: StatusEffect,
        node: ModNode,
    }[] = []
    for (let key in actor.owner.ss) {
        const st = actor.owner.ss[key]!
        if (st.tick?.calculateDamage) {
            const cd = calculateTick(st, actor.owner)
            ret.push({
                node: cd.calculateDamage!,
                source: st,
            })
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
    for (let key in actor.owner.ss) {
        const st = actor.owner.ss[key]!
        if (st.tick?.calculateHeal) {
            const ch = calculateTick(st, actor.owner)
            ret.push({
                node: ch.calculateHeal!,
                source: st,
            })
        }
    }
    return ret
}