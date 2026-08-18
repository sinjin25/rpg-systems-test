import type { OwnerMaximal } from "../actor2"
import { newStatusInstance } from "./instance"
import { StatusEffectInstance, StatusEffectWrapper } from "./types"

// test helper: wrap a status definition as a single applied instance so it can seed
// owner.ss (which now holds StatusEffectInstance[] per key). source is irrelevant for
// most contribution/decay tests, so it defaults to a throwaway.
export const inst = (
    w: StatusEffectWrapper,
    source: OwnerMaximal = {} as OwnerMaximal,
): StatusEffectInstance => newStatusInstance(w, source)

// seed one instance per given wrapper, keyed by displayName (mirrors addStatusToStatusSheet)
export const seed = (...wrappers: StatusEffectWrapper[]): Record<string, StatusEffectInstance[]> => {
    const ss: Record<string, StatusEffectInstance[]> = {}
    for (const w of wrappers) (ss[w.displayName] ??= []).push(inst(w))
    return ss
}
