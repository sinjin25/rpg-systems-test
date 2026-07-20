import rollInitiative, { calculateInitiativeMod } from "../../stat-modifier/initiative";
import calculateHp from "../../stat-modifier/hp";
import { Speed, STANDARD_SPEED } from "../../speed";
import { CharacterSheet } from "../../character-sheet";
import { FeatSheet } from "../../feat";
import { EquipmentSheet } from "../../equipment-sheet";
import { StatusSheet } from "../../status-sheet";
import { Ability, AbilityCategory, AbilitySheet } from "../../ability-sheet";
import { flatFootedStatus } from "../../status-sheet/statuses/flat-footed";

type Health = {
    max: number,
    curr: number,
    temporary: number,
}

export type Owner = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
    as: AbilitySheet,
}

export type Actor = {
    speed: Speed,
    health: Health,
    owner: Owner,
}

export const instantiateHealth = (
    owner: Owner
): Health => {
    const max = calculateHp(owner)
    const temporary = 0 // maybe feats or equipment later

    // display log: max.logs

    return {
        curr: max.total,
        max: max.total,
        temporary
    }
}

export const instantiateSpeed = (
    owner: Owner
): Speed => {
    const init = rollInitiative(owner)
    const remainder = init.total

    owner.ss['flatFooted'] = flatFootedStatus(STANDARD_SPEED - remainder)

    // display log: max.logs
    return {
        canAct: true, // maybe statuses, feats, equipment
        remainder,
    }
}

// advances a category's priority cursor: returns the ability at the cursor and moves
// the cursor forward. wrap cycles back to the start (swift/free, recycled every turn);
// without wrap the list is walked once (standard - the non-resetting cursor stands in
// for finite casts per day until charges exist)
export const takeNextAbility = (
    category: AbilityCategory,
    opts?: { wrap?: boolean },
): Ability | undefined => {
    if (category.priority.length === 0) return undefined
    if (category.index >= category.priority.length) {
        if (!opts?.wrap) return undefined // exhausted
        category.index = 0
    }
    const ability = category.items[category.priority[category.index]]
    category.index++
    return ability
}

export const resetAbilityCursors = (owner: Owner) => {
    if (!owner.as) return
    const as = owner.as
    for (let key of ['swift', 'standard', 'free'] as Array<keyof typeof as>) {
        const cat = as[key]
        if (!cat) continue
        cat.index = 0
    }
}

export const instantiateActor = (
    owner: Owner,
): Actor => {
    return {
        health: instantiateHealth(owner),
        owner,
        speed: instantiateSpeed(owner),
    }
}

export default instantiateActor