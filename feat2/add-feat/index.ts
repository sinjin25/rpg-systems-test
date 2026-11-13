import { Feat2 } from "../types";
import { OwnerMaximal } from "../../actor2/types";
import { meetsPrereq } from "../meets-prereq";

export const addFeat = (
    owner: OwnerMaximal,
    feat: Feat2
): boolean => {
    if (!meetsPrereq(owner, feat)) return false
    owner.fs = { ...owner.fs, [feat.id]: feat }
    return true
}

export default addFeat