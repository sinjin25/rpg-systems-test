import { calculateModifier } from ".."
import { calculateFeatMod } from "../../attack"
import { CharacterSheet } from "../../character-sheet"
import { BroadContexts, ContextNames } from "../../contexts"
import { EquipmentSheet } from "../../equipment-sheet"
import calculateEquipmentMod from "../../equipment-sheet/equipment-mod"
import { FeatSheet } from "../../feat"
import ModifierLog from "../log"

const calculateHp = (data: {
    cs: CharacterSheet,
    es: EquipmentSheet,
    fs: FeatSheet,
    ss: {},
}) => {
    const { cs, es, fs, ss } = data
    const log = ModifierLog('health')
    const contextTags: ContextNames[] = ['constitution']
    const broadContextStat: BroadContexts = 'stat'
    const broadContextHealth: BroadContexts = 'health'

    const allEquipment = Object.values(es)
    const modData = {
        characterSheet: cs,
        equipmentSheet: es,
        featSheet: fs,
    }

    // calculate effective con (base + bonuses)
    const conBonus = calculateEquipmentMod(allEquipment, modData, contextTags, broadContextStat)
        + calculateFeatMod(modData, contextTags, broadContextStat)
    const conMod = calculateModifier(cs.con, [conBonus])

    // calculate base health off con and level
    const PER_LEVEL = 10
    const baseHealth = (PER_LEVEL + conMod) * cs.level

    // calculate flat health bonuses
    const fm = calculateFeatMod(modData, [], broadContextHealth)
    const em = calculateEquipmentMod(allEquipment, modData, [], broadContextHealth)

    log.addMod({ displayName: 'base health', amount: baseHealth })
    log.addMod({ displayName: 'feats', amount: fm })
    log.addMod({ displayName: 'equipment', amount: em })

    return {
        total: baseHealth + fm + em,
        log,
    }
}

export default calculateHp
