import { calculateModifier, DEFAULT_AC, DEFAULT_STAT } from ".."
import { calculateFeatMod } from "../../attack"
import { CharacterSheet } from "../../character-sheet"
import { BroadContexts, ContextNames } from "../../contexts"
import { EquipmentSheet, equipmentIsArmor } from "../../equipment-sheet"
import calculateEquipmentMod from "../../equipment-sheet/equipment-mod"
import { FeatSheet } from "../../feat"
import ModifierLog from "../log"

type AcData = {
    cs: CharacterSheet,
    es: EquipmentSheet,
    fs: FeatSheet,
    ss: {},
}

export const calculateAc = (data: AcData) => {
    const { cs, es, fs } = data
    const log = ModifierLog('ac')
    const contextTags: ContextNames[] = ['dexterity']
    const broadContextStat: BroadContexts = 'stat'
    const broadContextAc: BroadContexts = 'ac'

    const allEquipment = Object.values(es)
    const modData = { cs, es, fs }

    // calculate effective dex (base + bonuses)
    const dexBonusEquip = calculateEquipmentMod(allEquipment, modData, contextTags, broadContextStat)
    const dexBonusFeat = calculateFeatMod(modData, contextTags, broadContextStat)
    const dexMod = calculateModifier(cs.dex, [dexBonusEquip.total + dexBonusFeat.total])

    // armor's flat, static ac bonus (not part of the generic mod-source system)
    // unarmored characters get no bonus here - the base 10 is already accounted
    // for by the 'base ac' group below
    const armor = es.armor
    const armorBonus = armor && equipmentIsArmor(armor) ? (armor.ac ?? 0) : 0

    // calculate flat ac bonuses
    const fm = calculateFeatMod(modData, [], broadContextAc)
    const em = calculateEquipmentMod(allEquipment, modData, [], broadContextAc)

    log.addModGroup('base ac', {
        total: DEFAULT_AC,
        entries: [{ displayName: 'base ac', amount: DEFAULT_AC }],
    })
    log.addModGroup('dexterity', {
        total: dexMod,
        entries: [{
            displayName: 'dex modifier',
            amount: dexMod,
            detail: [...dexBonusEquip.entries, ...dexBonusFeat.entries],
        }],
    })
    log.addModGroup('armor', {
        total: armorBonus,
        entries: armorBonus ? [{ displayName: armor?.displayName || 'Natural AC', amount: armorBonus }] : [],
    })
    log.addModGroup('feats', fm)
    log.addModGroup('equipment', em)

    return {
        total: DEFAULT_STAT + dexMod + armorBonus + fm.total + em.total,
        log,
    }
}

export default calculateAc
