import newModNode, { sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, CsScore } from "../types";
import baseSave from "../composition/base-save";
import saveStatusMod from "../composition/status/save-status-mod";
import csAsMod from "../composition/cs-as-mod";
import featContribution from "../composition/feat-contribution";
import modFromEquipment from "../composition/equipment/mod-from-equipment";

type Member = 'reflex' | 'fortitude' | 'will'

const saveTypeToCsScoreMap: Record<Member, CsScore> = {
    fortitude: 'con',
    reflex: 'dex',
    will: 'int',
}

export default (member: Member) => (owner: OwnerLog2) => {
    const base = baseSave(owner, member)
    const cs = saveTypeToCsScoreMap[member]
    const moddedCs = csAsMod(cs)(owner)
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