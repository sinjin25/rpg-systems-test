import { Actor2, OwnerMaximal } from "../actor2";
import { applyDamage, applyHeal } from "../health";
import { ModNode } from "../log2";
import { StatusEffect, Tick } from "./types";

export const calculateTick = (status: StatusEffect, receiver: OwnerMaximal): {
    [K in keyof Tick]: ModNode | undefined
} => {
    const ret: { [K in keyof Tick]: ModNode | undefined } = {
        calculateDamage: undefined,
        calculateHeal: undefined,
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

export const applyTicks = (
    actor: Actor2
) => {
    const ticks: ModNode[] = []
    for (const key of Object.keys(actor.owner.ss)) {
        const st = actor.owner.ss[key]!

        if (!st.tick) continue
        const { calculateDamage, calculateHeal } = calculateTick(st, actor.owner)
        if (calculateDamage) {
            applyDamage(actor.health, calculateDamage.total())
            ticks.push(calculateDamage)
        }
        if (calculateHeal) {
            applyHeal(actor.health, calculateHeal.total())
            ticks.push(calculateHeal)
        }
    }

    return ticks
}