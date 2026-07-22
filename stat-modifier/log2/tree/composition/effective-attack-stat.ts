import newModNode, { maxFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import moddedStr from "./modded-str";
import moddedDex from "./modded-dex";

const displayName: EveryTree = 'effective-attack-stat'

// Which stat an attack uses. Normally the WEAPON decides: a weapon tagged 'finesse' uses dex,
// everything else (including a bare hand with no mainhand) uses str. "The weapon" is faked as the
// mainhand for now.
//
// The Weapon Finesse FEAT (deferred) will later override this by making BOTH stats candidates and
// letting maxFunc pick the bigger. That is why the fold is already maxFunc: today there is exactly
// one candidate, so max-of-one is just that stat, and the feat case slots in by attaching the
// second candidate - no fold change.
const effectiveAttackStat = (owner: OwnerMaximal) => {
    const mainhand = owner.es.mainhand
    const isFinesse = !!mainhand?.contexts?.includes('finesse')

    const candidate = isFinesse ? moddedDex(owner) : moddedStr(owner)

    return newModNode(displayName, [candidate], maxFunc)
}

export default effectiveAttackStat
