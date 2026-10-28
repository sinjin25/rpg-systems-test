import { Feat2, Feat2Wrapper, FeatIds } from "../types";
import registry from "../registry";
import { OwnerMaximal } from "../../actor2";
import { meetsPrereq } from "../meets-prereq";

export const newFeatsForOwnerList = (
    owner: OwnerMaximal,
    reg: Record<FeatIds, Feat2> = registry
): Feat2Wrapper[] => {
    return (Object.keys(reg) as FeatIds[]).map((id): Feat2Wrapper => {
        const pointer = reg[id]
        return {
            id,
            pointer,
            meetsPrereq: meetsPrereq(owner, pointer),
            owned: owner.fs[id] !== undefined,
            hide: false,
        }
    })
}

export default newFeatsForOwnerList
