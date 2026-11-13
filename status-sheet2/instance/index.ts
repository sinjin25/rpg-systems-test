import type { OwnerMaximal } from "../../actor2/types";
import type { StatusExpiration } from "../decay/types";
import type {
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

// a status definition minus the stack policy (defaults to 'highest') and hidden (defaults to false)
type StatusDefinition = Omit<StatusEffect, 'stack' | 'hidden'> & { stack?: StatusEffectStack, hidden?: boolean }

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
    // a fixed expiration, or a thunk rolled per instance (e.g. a random duration)
    expiration?: StatusExpiration | (() => StatusExpiration)
}

// this return type works but it's a mess
// revisit at some point
export const makeWrapper = <const D extends StatusDefinition>(
    statusEffect: D,
    opts: MakeWrapperOpts = {}
) => {
    const pointer = { stack: { kind: 'highest' as const }, hidden: false, ...statusEffect }
    const factory: StatusEffectInstanceFactory = (source) => ({
        pointer,
        source, // as in the caster, not the definition
        expiration: typeof opts.expiration === 'function' ? opts.expiration() : opts.expiration && { ...opts.expiration },
        tick: resolveTick(pointer.tick, source),
    })
    return { ...pointer, factory }
}
