import { OwnerMaximal } from "../log2/types";


const expireStatus = (
    owner: OwnerMaximal,
    key: string,
) => {
    const s = owner.ss[key]
    if (!s) return
    delete owner.ss[key]

    // possibly chain
    const next = s.onExpiration?.(owner)
}