import newModNode, { leaf, ModNode, sumFunc } from "..";
import { deriveFeatName } from "../../feat2/feats";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";


const displayName: EveryTree = 'proficiency-penalty'
// this is the WOTR number
const PENALTY = -4

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const slot = opts.relevantSlot ?? owner.es.mainhand
    if (!slot) throw Error('relevant slot was not passed')

    const children: ModNode[] = []

    if (opts.tags && opts.tags.includes('martial') && owner.fs['martial proficiency'] === undefined) {
        children.push(leaf('not proficient (martial)', PENALTY))
    }

    if (opts.tags && opts.tags.includes('exotic') && owner.fs['exotic proficiency'] === undefined) {
        children.push(leaf('not proficient (exotic)', PENALTY))
    }

    if (children.length === 0) return undefined

    return newModNode(displayName, children, sumFunc)
}