import { Feat2 } from "../types";
import { OwnerMaximal } from "../../actor2";
import { meetsPrereq } from "../meets-prereq";

export const addFeat = (
    owner: OwnerMaximal,
    feat: Feat2
): boolean => {
    if (!meetsPrereq(owner, feat)) return false
    owner.fs = { ...owner.fs, [feat.displayName]: feat }
    return true
}

export default addFeat