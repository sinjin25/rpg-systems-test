import { calculateModifier, DEFAULT_AC, DEFAULT_STAT } from ".."
import { calculateFeatMod } from "../../attack"
import { CharacterSheet } from "../../character-sheet"
import { BroadContexts, ContextNames } from "../../contexts"
import { Armor, EquipmentSheet, equipmentIsArmor } from "../../equipment-sheet"
import calculateEquipmentMod from "../../equipment-sheet/equipment-mod"
import { extractContextsTags } from "../../equipment-sheet/extract"
import { FeatSheet } from "../../feat"
import { StatusSheet } from "../../status-sheet"
import { calculateStatusMod } from "../../status-sheet/status-mod"
import ModifierLog, { ModLogMember } from "../log"

type AcData = {
    cs: CharacterSheet,
    es: EquipmentSheet,
    fs: FeatSheet,
    ss: StatusSheet,
}

export const calculateAc = (data: AcData) => {
    const { cs, es, fs, ss } = data
    const log = ModifierLog('ac')
    const contextTags: ContextNames[] = ['dexterity']
    const broadContextStat: BroadContexts = 'stat'
    const broadContextAc: BroadContexts = 'ac'
    const broadContextMaxDex: BroadContexts = 'maxDex'

    const allEquipment = Object.values(es)
    const modData = { cs, es, fs, ss }

    // Armor has an ac property (as opposed to general equipment)
    // which has a ac broadContext mod
    // shields are considered Armor
    const acPieces = allEquipment.filter((e): e is Armor => !!e && equipmentIsArmor(e))

    // calculate effective dex (base + bonuses)
    const dexBonusEquip = calculateEquipmentMod(allEquipment, modData, contextTags, broadContextStat)
    const dexBonusFeat = calculateFeatMod(modData, contextTags, broadContextStat)
    const dexBonusStatus = calculateStatusMod(modData, contextTags, broadContextStat)
    const dexDetail: ModLogMember[] = [...dexBonusEquip.entries, ...dexBonusFeat.entries, ...dexBonusStatus.entries]
    const finalDex = calculateModifier(cs.dex, [dexBonusEquip.total + dexBonusFeat.total + dexBonusStatus.total])

    // find the lowest maxDexBonus item (if any exists)
    const capPieces = acPieces.filter(e => e.maxDexBonus !== undefined)
    // explanation: finalDex is the player's mod, we still need to figure out if the mod is too big for the equipment
    let dexMod = finalDex
    if (capPieces.length) {
        // this is the lowest
        const base = Math.min(...capPieces.map(e => e.maxDexBonus as number))
        // calculate any maxDex BroadContexts that may increase it
        // ex: fighter's armor training feature
        const maxDexFeat = calculateFeatMod(modData, [], broadContextMaxDex)
        const maxDexEquip = calculateEquipmentMod(allEquipment, modData, [], broadContextMaxDex)
        const maxDexStatus = calculateStatusMod(modData, [], broadContextMaxDex)
        const finalMaxDex = base + maxDexFeat.total + maxDexEquip.total + maxDexStatus.total
        // ex: +6 dex but finalMaxDex is +3 (or vice versa)
        dexMod = Math.min(finalDex, finalMaxDex)
        // if this isn't boosted then we don't need to make a log
        if (dexMod !== finalDex) {
            const capSourceName = capPieces.find(e => e.maxDexBonus === base)?.displayName ?? 'armor'
            dexDetail.push({ displayName: `max dex (${capSourceName})`, amount: dexMod - finalDex })
            dexDetail.push(...maxDexFeat.entries, ...maxDexEquip.entries, ...maxDexStatus.entries)
        }
    }

    // sum of armor ac
    // we have not included base ac (10) yet
    const armorEntries: ModLogMember[] = acPieces
        .filter(e => (e.ac ?? 0) !== 0)
        .map(e => ({ displayName: e.displayName, amount: e.ac as number }))
    const armorBonus = armorEntries.reduce((sum, e) => sum + e.amount, 0)

    // get the context tags from relevant equipment (ex: shield, heavyArmor)
    // this is for mods
    const acContextTags = acPieces.flatMap(e => extractContextsTags(e))
    const fm = calculateFeatMod(modData, acContextTags, broadContextAc)
    const em = calculateEquipmentMod(allEquipment, modData, acContextTags, broadContextAc)
    const sm = calculateStatusMod(modData, acContextTags, broadContextAc)

    log.addModGroup('base ac', {
        total: DEFAULT_AC,
        entries: [{ displayName: 'base ac', amount: DEFAULT_AC }],
    })
    log.addModGroup('dexterity', {
        total: dexMod,
        entries: [{
            displayName: 'dex modifier',
            amount: dexMod,
            detail: dexDetail,
        }],
    })
    log.addModGroup('armor', {
        total: armorBonus,
        entries: armorEntries,
    })
    log.addModGroup('feats', fm)
    log.addModGroup('equipment', em)
    log.addModGroup('statuses', sm)

    return {
        total: DEFAULT_STAT + dexMod + armorBonus + fm.total + em.total + sm.total,
        log,
    }
}

export default calculateAc
