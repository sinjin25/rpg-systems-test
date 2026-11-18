import { DiscreteTargetGroupPayloadResolution } from "../../ability-sheet2/abilities2/types";
import { ModNode } from "../../log2";
import { FrozenAbilityNode } from "../types";
import serializeModNode from "./mod-node";
import snapshotActor from "./actor";
import { serializeStatusEffect } from "./status-effect";

export const serializeAbilityResolution = (r: DiscreteTargetGroupPayloadResolution, damageTaken?: ModNode[]): FrozenAbilityNode => {
    return {
        type: r.type,
        target: snapshotActor(r.target),
        dc: r.dc ? serializeModNode(r.dc) : undefined,
        save: r.save ? serializeModNode(r.save) : undefined,
        saveType: r.saveType,
        damage: r.damage?.map(serializeModNode),
        damageTaken: damageTaken?.map(serializeModNode),
        heal: r.heal?.map(serializeModNode),
        // no usage other than potential UI narration or something
        // a later TT event will have the status effect added to a sheet
        // just order of operations shit
        statusEffect: r.statusEffect?.map(serializeStatusEffect),
    }
}

const serializeAbilityResolutions = (
    resolutions: { r: DiscreteTargetGroupPayloadResolution, damageTaken?: ModNode[] }[]
): FrozenAbilityNode[] => resolutions.map(({ r, damageTaken }) => serializeAbilityResolution(r, damageTaken))

export default serializeAbilityResolutions
