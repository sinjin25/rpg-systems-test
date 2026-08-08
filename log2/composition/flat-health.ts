import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerLog2, TreeSubproblems } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'flat-health'
export default (owner: OwnerLog2) => {
    const fromEquipment = Object.values(owner.es).map(a => {
        return a.broadContexts['health-equipment-mod']
    }).filter(a => !!a).map(a => a(owner)).filter(a => !!a)
    const subproblems: TreeSubproblems = {
        'health-feat-mod': featContribution('health-feat-mod')(owner),
        'health-equipment-mod': newModNode(
            'health-equipment-mod',
            fromEquipment,
            sumFunc,
        ),
        // TODO: status
    }

    const subpr = Object.values(subproblems).filter(a => !!a)
    return newModNode(displayName, subpr, sumFunc)
}