// the lowest max-dex cap across worn armor

import newModNode, { leaf, minFunc, sumFunc } from "..";
import { OwnerLog2, EveryTree } from "../types";
import maxDexOfEquipmentPiece from "../bases/max-dex-of-equipment-piece";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'max-dex-of-equipment'

export default (owner: OwnerLog2) => {
    // guard: look for flat-footed first
    const flatFooted = owner.ss.flatFooted

    const items = Object.values(owner.es)
    const pieces = items.map(a => maxDexOfEquipmentPiece(a)(owner))
        .filter(a => !!a)

    if (flatFooted) pieces.push(leaf('flat-footed', 0))

    // no armor worn -> no cap at all. must stay ahead of the feat mod so an
    // unarmored character doesn't gain a cap out of nowhere.
    if (pieces.length === 0) return undefined

    // the tightest cap across worn pieces, which feats then loosen (Armor Training +1)
    const cap = newModNode(
        'max-dex-of-equipment-cap',
        pieces,
        () => {
            return minFunc(pieces)
        },
    )

    const children = [cap, featContribution('max-dex-feat-mod')(owner)]

    return newModNode(
        displayName,
        children,
        sumFunc,
    )
}