import rollInitiative, { calculateInitiativeMod } from "../../stat-modifier/initiative";
import calculateHp from "../../stat-modifier/hp";
import calculateAc from "../../stat-modifier/ac";
import { Speed, STANDARD_SPEED } from "../../speed";
import { CharacterSheet } from "../../character-sheet";
import { FeatSheet } from "../../feat";
import { EquipmentSheet } from "../../equipment-sheet";
import { StatusSheet } from "../../status-sheet";
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
}

export type Actor = {
    speed: Speed,
    health: Health,
    ac: number,
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

export const instantiateAc = (
    owner: Owner
): number => {
    return calculateAc(owner).total
}

export const instantiateActor = (
    owner: Owner,
): Actor => {
    return {
        health: instantiateHealth(owner),
        ac: instantiateAc(owner),
        owner,
        speed: instantiateSpeed(owner),
    }
}

export default instantiateActor