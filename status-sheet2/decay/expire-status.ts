import { StatusEffect } from "../types";
import { DecayOwner } from "./types";

export const expireStatus = (owner: DecayOwner, key: string): StatusEffect | undefined => {
    const status = owner.ss[key]
    if (!status) return
    delete owner.ss[key]
    return status
}
