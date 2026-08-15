import { DiscreteTargetGroupPayloadResolution } from "../../ability-sheet2";
import { FrozenAbilityNode } from "../types";
import freezeModNodeRecursive from "./mod-node";
import freezeStatus from "./status";

const freezeResolution = (r: DiscreteTargetGroupPayloadResolution): FrozenAbilityNode => {
    return {
        type: r.type,
        dc: r.dc ? freezeModNodeRecursive(r.dc) : undefined,
        save: r.save ? freezeModNodeRecursive(r.save) : undefined,
        saveType: r.saveType,
        damage: r.damage?.map(freezeModNodeRecursive),
        heal: r.heal?.map(freezeModNodeRecursive),
        statusEffect: r.statusEffect?.map(freezeStatus),
    }
}

export default freezeResolution
