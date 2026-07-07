import { calculateModifier } from ".."
import { calculateFeatMod } from "../../attack"
import { CharacterSheet } from "../../character-sheet"
import { BroadContexts, ContextNames } from "../../contexts"
import { EquipmentSheet } from "../../equipment-sheet"
import calculateEquipmentMod from "../../equipment-sheet/equipment-mod"
import { FeatSheet } from "../../feat"
import roll from "../../roll"
import ModifierLog from "../log"

type InitiativeData = {
    cs: CharacterSheet,
    es: EquipmentSheet,
    fs: FeatSheet,
    ss: {},
}

export const calculateInitiativeMod = (data: InitiativeData) => {
    const { cs, es, fs, ss } = data
    const log = ModifierLog('initiative')
    const contextTags: ContextNames[] = ['dexterity']
    const broadContextStat: BroadContexts = 'stat'
    const broadContextInitiative: BroadContexts = 'initiative'

    const allEquipment = Object.values(es)
    const modData = {
        characterSheet: cs,
        equipmentSheet: es,
        featSheet: fs,
    }

    // calculate effective dex (base + bonuses)
    const dexBonus = calculateEquipmentMod(allEquipment, modData, contextTags, broadContextStat)
        + calculateFeatMod(modData, contextTags, broadContextStat)
    const dexMod = calculateModifier(cs.dex, [dexBonus])

    // calculate flat initiative bonuses
    const fm = calculateFeatMod(modData, [], broadContextInitiative)
    const em = calculateEquipmentMod(allEquipment, modData, [], broadContextInitiative)

    log.addMod({ displayName: 'dexterity', amount: dexMod })
    log.addMod({ displayName: 'feats', amount: fm })
    log.addMod({ displayName: 'equipment', amount: em })

    return {
        total: dexMod + fm + em,
        log,
    }
}

export const rollInitiative = (data: InitiativeData) => {
    const { log } = calculateInitiativeMod(data)
    log.addRoll({ displayName: 'd20', amount: roll(20) })

    return {
        total: log.finalResult().total,
        log,
    }
}

export default rollInitiative
