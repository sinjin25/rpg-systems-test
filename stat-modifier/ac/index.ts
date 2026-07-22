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
import ModifierLog, { ModGroup, ModLogMember, ModResult } from "../log"

type AcData = {
    cs: CharacterSheet,
    es: EquipmentSheet,
    fs: FeatSheet,
    ss: StatusSheet,
}

// the group names calculateAc's log is built from
export type AcGroup =
    | 'base ac'
    | 'dexterity'
    | 'armor'
    | 'feats'
    | 'equipment'
    | 'statuses'

// Armor has an ac property (as opposed to general equipment)
// which has a ac broadContext mod
// shields are considered Armor
const acPiecesOf = (es: EquipmentSheet) =>
    Object.values(es).filter((e): e is Armor => !!e && equipmentIsArmor(e))

export const _calculateEffectiveDex = (data: AcData): ModResult => {
    const { cs, es } = data
    const contextTags: ContextNames[] = ['dexterity']
    const broadContextStat: BroadContexts = 'stat'

    const allEquipment = Object.values(es)
    const dexBonusEquip = calculateEquipmentMod(allEquipment, data, contextTags, broadContextStat)
    const dexBonusFeat = calculateFeatMod(data, contextTags, broadContextStat)
    const dexBonusStatus = calculateStatusMod(data, contextTags, broadContextStat)

    return {
        total: calculateModifier(cs.dex, [dexBonusEquip.total + dexBonusFeat.total + dexBonusStatus.total]),
        entries: [...dexBonusEquip.entries, ...dexBonusFeat.entries, ...dexBonusStatus.entries],
    }
}

export const _calculateMaxDexMod = (data: AcData): ModGroup | undefined => {
    const { es } = data
    const broadContextMaxDex: BroadContexts = 'maxDex'

    // find the lowest maxDexBonus item (if any exists)
    const capPieces = acPiecesOf(es).filter(e => e.maxDexBonus !== undefined)
    if (!capPieces.length) return undefined

    // this is the lowest
    const base = Math.min(...capPieces.map(e => e.maxDexBonus as number))
    // calculate any maxDex BroadContexts that may increase it
    // ex: fighter's armor training feature
    const allEquipment = Object.values(es)
    const maxDexFeat = calculateFeatMod(data, [], broadContextMaxDex)
    const maxDexEquip = calculateEquipmentMod(allEquipment, data, [], broadContextMaxDex)
    const maxDexStatus = calculateStatusMod(data, [], broadContextMaxDex)

    return {
        displayName: capPieces.find(e => e.maxDexBonus === base)?.displayName ?? 'armor',
        total: base + maxDexFeat.total + maxDexEquip.total + maxDexStatus.total,
        entries: [...maxDexFeat.entries, ...maxDexEquip.entries, ...maxDexStatus.entries],
    }
}

// sum of armor ac
// we have not included base ac (10) yet
export const _calculateArmorBonus = (data: AcData): ModResult => {
    const entries: ModLogMember[] = acPiecesOf(data.es)
        .filter(e => (e.ac ?? 0) !== 0)
        .map(e => ({ displayName: e.displayName, amount: e.ac as number }))

    return {
        total: entries.reduce((sum, e) => sum + e.amount, 0),
        entries,
    }
}

export const calculateAc = (data: AcData) => {
    const { cs, es, fs, ss } = data
    const log = ModifierLog<AcGroup>('ac')
    const broadContextAc: BroadContexts = 'ac'

    const allEquipment = Object.values(es)
    const modData = { cs, es, fs, ss }
    const acPieces = acPiecesOf(es)

    // explanation: effectiveDex is the player's mod, we still need to figure out
    // if the mod is too big for the equipment
    const effectiveDex = _calculateEffectiveDex(modData)
    const cap = _calculateMaxDexMod(modData)
    // ex: +6 dex but the cap is +3 (or vice versa)
    const dexMod = cap ? Math.min(effectiveDex.total, cap.total) : effectiveDex.total

    const dexDetail: ModLogMember[] = [...effectiveDex.entries]
    // if this isn't capped then we don't need to make a log
    if (cap && dexMod !== effectiveDex.total) {
        dexDetail.push({ displayName: `max dex (${cap.displayName})`, amount: dexMod - effectiveDex.total })
        dexDetail.push(...cap.entries)
    }

    const armor = _calculateArmorBonus(modData)

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
    log.addModGroup('armor', armor)
    log.addModGroup('feats', fm)
    log.addModGroup('equipment', em)
    log.addModGroup('statuses', sm)

    return {
        total: DEFAULT_STAT + dexMod + armor.total + fm.total + em.total + sm.total,
        log,
    }
}

export default calculateAc
