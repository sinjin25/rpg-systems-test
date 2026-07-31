import newModNode, { maxFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import moddedCsScore from "./modded-cs-score";

const displayName: EveryTree = 'effective-attack-stat'

// Which stat an attack uses. The WEAPON decides: a finesse weapon lets the attack use dex IN PLACE
// OF str - but that is a choice you only make when dex is better, so both stats are candidates and
// maxFunc picks the winner (pathfinder: a finesse weapon never makes a str build attack worse). A
// non-finesse weapon, and a bare hand with no mainhand, can only ever use str. "The weapon" is faked
// as the mainhand for now.
//
// NOTE: finesse changes only the ATTACK roll. Damage still uses str unless a feat/property says
// otherwise (Slashing/Fencing Grace, Agile) - so a damage node must NOT reuse this. See damage.ts.
const effectiveAttackStat = (owner: OwnerLog2) => {
    const mainhand = owner.es.mainhand
    const isFinesse = !!mainhand?.tags?.includes('finesse')

    const candidates = isFinesse
        ? [moddedCsScore('dex')(owner), moddedCsScore('str')(owner)]
        : [moddedCsScore('str')(owner)]

    return newModNode(displayName, candidates, maxFunc)
}

export default effectiveAttackStat
