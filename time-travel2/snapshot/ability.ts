import { DiscreteTargetGroupPayloadResolution } from "../../ability-sheet2";
import { FrozenAbilityNode } from "../types";
import freezeModNodeRecursive from "./mod-node";
import { freezeStatusDefinition } from "./status";

const freezeResolution = (r: DiscreteTargetGroupPayloadResolution): FrozenAbilityNode => {
    return {
        type: r.type,
        dc: r.dc ? freezeModNodeRecursive(r.dc) : undefined,
        save: r.save ? freezeModNodeRecursive(r.save) : undefined,
        saveType: r.saveType,
        damage: r.damage?.map(freezeModNodeRecursive),
        heal: r.heal?.map(freezeModNodeRecursive),
        // no usage other than potential UI narration or something
        // a later TT event will have the status effect added to a sheet
        // just order of operations shit
        statusEffect: r.statusEffect?.map(freezeStatusDefinition),
    }
}

export default freezeResolution
