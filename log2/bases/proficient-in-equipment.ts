import newModNode, { leaf, ModNode, sumFunc } from "..";
import { deriveFeatKey, featExoticProficiency, featMartialProficiency } from "../../feat2/registry";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";

const displayName: EveryTree = 'proficiency-penalty'
// this is the WOTR number
const PENALTY = -4

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const slot = opts.relevantSlot ?? owner.es.mainhand
    if (!slot) throw Error('relevant slot was not passed')

    const children: ModNode[] = []

    if (opts.tags
        && opts.tags.includes('martial')
        && owner.fs[deriveFeatKey(featMartialProficiency)] === undefined) {
        children.push(leaf('not proficient (martial)', PENALTY))
    }

    if (opts.tags
        && opts.tags.includes('exotic')
        && owner.fs[deriveFeatKey(featExoticProficiency)] === undefined) {
        children.push(leaf('not proficient (exotic)', PENALTY))
    }

    if (children.length === 0) return undefined

    return newModNode(displayName, children, sumFunc)
}