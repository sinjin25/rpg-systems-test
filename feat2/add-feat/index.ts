import { Feat2 } from "..";
import { OwnerMaximal } from "../../actor2";

export const addFeat = (
    owner: OwnerMaximal,
    feat: Feat2
): boolean => {
    const meetsPrerequisites = feat?.prerequisites?.(owner) ?? true
    if (!meetsPrerequisites) return false
    owner.fs[feat.displayName] = feat
    return true
}

export default addFeat