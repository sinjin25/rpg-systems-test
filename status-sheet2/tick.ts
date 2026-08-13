import { Actor2, OwnerMaximal } from "../actor2";
import { applyDamage, applyHeal } from "../health";
import { ModNode } from "../log2";
import damageOverTimeTaken from "../log2/terminal-composition/damage-over-time-taken";
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
        if (st.tick.calculateDamage) {
            console.log('found a tick status', st)
            const cd = calculateTick(st, actor.owner)
            const dott = damageOverTimeTaken({
                node: cd!.calculateDamage,
            })(actor.owner)

            ret.push({
                node: dott,
                source: st,
            })
        }
    }
    return ret
}

// DEPRECATE
export const applyTicks = (
    actor: Actor2
) => {
    const ticks: TickInstance[] = []
    for (const key of Object.keys(actor.owner.ss)) {
        const st = actor.owner.ss[key]!

        if (!st.tick) continue
        const { calculateDamage, calculateHeal, source } = calculateTick(st, actor.owner)
        if (calculateDamage) {
            applyDamage(actor.health, calculateDamage.total())
            ticks.push({
                calculateDamage,
                source,
            })
        }
        if (calculateHeal) {
            applyHeal(actor.health, calculateHeal.total())
            ticks.push({
                source,
                calculateHeal,
            })
        }
    }

    return ticks
}