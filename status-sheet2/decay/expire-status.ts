import { StatusEffectInstance } from "../types";
import { DecayOwner } from "./types";

// remove a single instance from its key's array; deletes the key once it's empty
export const expireStatus = (
    owner: DecayOwner,
    key: string,
    instance: StatusEffectInstance,
): StatusEffectInstance | undefined => {
    const instances = owner.ss[key]
    if (!instances) return

    const idx = instances.indexOf(instance)
    if (idx === -1) return

    instances.splice(idx, 1)
    if (instances.length === 0) delete owner.ss[key]

    return instance
}
