import { calculateFeatMod } from "../../attack"
import { CharacterSheet } from "../../character-sheet"
import { BroadContexts, ContextNames } from "../../contexts"
import { EquipmentSheet } from "../../equipment-sheet"
import calculateEquipmentMod from "../../equipment-sheet/equipment-mod"
import { FeatSheet } from "../../feat"
import { StatusSheet } from "../../status-sheet"
import { calculateStatusMod } from "../../status-sheet/status-mod"
import ModifierLog from "../log"

type DamageTakenData = {
    cs: CharacterSheet,
    es: EquipmentSheet,
    fs: FeatSheet,
    ss: StatusSheet,
}

// this is where to calculate things like increased damage or DR or feats
// this is from the perspective of the person getting hit
// things like studied target +dmg taken are also applied here
export const calculateDamageTaken = (
    data: DamageTakenData,
    amount: number,
    // make sure to include attacker's tags
    context: ContextNames[] = [],
) => {
    const { cs, es, fs, ss } = data
    const log = ModifierLog('damage taken')
    const broadContext: BroadContexts = 'damageTaken'

    const allEquipment = Object.values(es)
    const modData = { cs, es, fs, ss }

    const fm = calculateFeatMod(modData, context, broadContext)
    const em = calculateEquipmentMod(allEquipment, modData, context, broadContext)
    const sm = calculateStatusMod(modData, context, broadContext)

    log.addModGroup('incoming damage', {
        total: amount,
        entries: [{ displayName: 'incoming damage', amount }],
    })
    log.addModGroup('feats', fm)
    log.addModGroup('equipment', em)
    log.addModGroup('statuses', sm)

    return {
        // floored so a reduction bigger than the hit can't turn into healing
        total: Math.max(0, amount + fm.total + em.total + sm.total),
        log,
    }
}

export default calculateDamageTaken
