import { OwnerMaximal } from "../../actor2";
import { StatusExpiration } from "../decay/types";
import {
    StatusEffect,
    StatusEffectInstance,
    StatusEffectInstanceFactory,
    StatusEffectStack,
    StatusEffectWrapper,
    ResolvedTick,
    Tick,
    TickCalc,
    ResolvedTickCalc,
} from "../types";

// a status definition minus the stack policy, which makeWrapper defaults to 'highest'.
type StatusDefinition = Omit<StatusEffect, 'stack'> & { stack?: StatusEffectStack }

export const newStatusInstance = (
    st: StatusEffectWrapper,
    creator: OwnerMaximal
): StatusEffectInstance => {
    return st.factory(creator)
}

// freeze the source-side mod at apply time; base stays a per-tick thunk
const resolveTickCalc = (calc: TickCalc, source: OwnerMaximal): ResolvedTickCalc => ({
    base: calc.base,
    mod: calc.mod(source),
})

const resolveTick = (tick: Tick | undefined, source: OwnerMaximal): ResolvedTick | undefined => {
    if (!tick) return undefined
    return {
        calculateDamage: tick.calculateDamage && resolveTickCalc(tick.calculateDamage, source),
        calculateHeal: tick.calculateHeal && resolveTickCalc(tick.calculateHeal, source),
    }
}

type MakeWrapperOpts = {
    expiration?: StatusExpiration
}

// builds the wrapper + default factory; stack defaults to 'highest'
export const makeWrapper = (
    statusEffect: StatusDefinition,
    opts: MakeWrapperOpts = {}
): StatusEffectWrapper => {
    const pointer: StatusEffect = { stack: { kind: 'highest' }, ...statusEffect }
    const factory: StatusEffectInstanceFactory = (source) => ({
        pointer,
        source, // as in the caster, not the definition
        ...opts,
        tick: resolveTick(pointer.tick, source),
    })
    return { ...pointer, factory }
}
