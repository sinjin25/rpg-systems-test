import { BaseEquipment } from "../../equipment-sheet2/types";
import { OwnerLog2 } from "../types";
import { deriveFeatName } from "../../feat2/feats";
import featShieldProficiency from "../../feat2/feats/shield-proficiency";
import featTowerShieldProficiency from "../../feat2/feats/tower-shield-proficiency";

// tower shields require their own feat — Shield Proficiency does not cover them
export default (equipment: BaseEquipment) => (owner: OwnerLog2): boolean => {
    const tags = equipment.tags ?? []

    if (tags.includes('tower-shield')) return owner.fs[deriveFeatName(featTowerShieldProficiency)] !== undefined
    if (tags.includes('shield')) return owner.fs[deriveFeatName(featShieldProficiency)] !== undefined

    return true
}
