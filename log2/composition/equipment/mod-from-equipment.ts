import newModNode, { ModNode, sumFunc } from "../..";
import { EquipmentSlot, EveryTree, OwnerMaximal } from "../../types";

// THIS SHOULD BE LIFTED UP INTO EQUIPMENT2
export const collectEquipmentTags = (
    owner: OwnerMaximal,
    slots: EquipmentSlot[] = []
) => {
    const DEFAULT_SLOTS: EquipmentSlot[] = [
        'amulet', 'armor', 'mainhand', 'offhand', "ring", "twohanded"
    ]
    const slotsToUse = slots.length === 0 ? DEFAULT_SLOTS : slots

    const tagCollector: string[] = []
    for (let slot of slotsToUse) {
        const sl = owner.es[slot]
        if (sl && sl.tags && sl.tags.length > 0) {
            tagCollector.push(...sl.tags)
        }
    }
    return Array.from(new Set(tagCollector))
}

const collectEquipmentContributions = (
    owner: OwnerMaximal,
    broadContext: EveryTree
): ModNode[] => {
    const v = Object.values(owner.es)
        .filter(e => !!e)

    const relevant = v.map(a => a.broadContexts?.[broadContext])
        .filter(f => !!f) // return ones without a handler there
        .map(f => f(owner)) // apply the handler
        .filter(v => !!v) // remove ones that didn't apply (returned undefined)

    return relevant
}

export default (member: EveryTree) => (owner: OwnerMaximal) => {
    return newModNode(member, collectEquipmentContributions(owner, member), sumFunc)
}