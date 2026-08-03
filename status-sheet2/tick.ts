import { Actor2, OwnerMaximal } from "../actor2";
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

export const applyTicks = () => { }