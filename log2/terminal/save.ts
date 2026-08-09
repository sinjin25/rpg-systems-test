import newModNode, { sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../types";
import baseSave from "../composition/base-save";
import saveStatusMod from "../composition/status/save-status-mod";
import moddedCsScore from "../composition/modded-cs-score";
import featContribution from "../composition/feat-contribution";
import modFromEquipment from "../composition/equipment/mod-from-equipment";

type Member = 'reflex' | 'fortitude' | 'will'
export default (member: Member) => (owner: OwnerLog2) => {
    const base = baseSave(owner, member)
    const cs = member === 'reflex' ? 'dex' : member === 'fortitude' ? 'con' : 'int'
    if (cs === 'int') throw Error('int not implemented')
    const moddedCs = moddedCsScore(cs)(owner)
    const featMod = featContribution(`${member}-feat-mod`)(owner)
    const statusMod = saveStatusMod(member)(owner)
    const equipmentMod = modFromEquipment(`${member}-equipment-mod`)(owner)

    const subpr = [
        base, moddedCs, featMod, statusMod, equipmentMod
    ].filter(a => a.total())

    return newModNode(
        member,
        subpr,
        () => sumFunc(subpr)
    )
}