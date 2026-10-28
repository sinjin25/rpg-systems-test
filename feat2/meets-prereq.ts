import { Feat2 } from "./types"
import { OwnerMaximal } from "../actor2"

export const meetsPrereq = (owner: OwnerMaximal, feat: Feat2): boolean =>
    feat.prerequisites?.(owner) ?? true

export default meetsPrereq
