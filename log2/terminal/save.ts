import newModNode, { sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, CsScore, ModNodeOpts } from "../types";
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

export default (member: Member) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const base = baseSave(owner, member, opts)
    const cs = saveTypeToCsScoreMap[member]
    const moddedCs = csAsMod(cs)(owner, opts)
    const featMod = featContribution(`${member}-feat-mod`)(owner, opts)
    const statusMod = saveStatusMod(member)(owner, opts)
    const equipmentMod = modFromEquipment(`${member}-equipment-mod`)(owner, opts)

    const subpr = [
        base, moddedCs, featMod, statusMod, equipmentMod
    ].filter(a => a.total())

    return newModNode(
        member,
        subpr,
        () => sumFunc(subpr)
    )
}
