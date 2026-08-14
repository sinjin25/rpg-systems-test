import { Ability, AbilityModNode, abilityModNodePayloadIsModNode } from "../../ability-sheet2";
import { FrozenAbilityNode } from "../types";
import freezeModNodeRecursive from "./mod-node";
import freezeStatus from "./status";

const handlePayload = (payload: AbilityModNode['payload']) => {
    if (abilityModNodePayloadIsModNode(payload)) {
        return freezeModNodeRecursive(payload)
    } else {
        return freezeStatus(payload)
    }
}

const freezeAbilityModNode = (root: AbilityModNode): FrozenAbilityNode => {
    const { payload, target, dc, save } = root

    return {
        dc: dc ? freezeModNodeRecursive(dc) : undefined,
        save: save ? freezeModNodeRecursive(save) : undefined,
        payload: handlePayload(payload),
        target: target,
    }
}

export default freezeAbilityModNode