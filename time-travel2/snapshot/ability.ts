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
        dc: freezeModNodeRecursive(dc),
        save: freezeModNodeRecursive(save),
        payload: handlePayload(payload),
        target: target,
    }
}