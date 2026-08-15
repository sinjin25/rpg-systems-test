import { Actor2, OwnerMaximal } from "../../actor2"
import target from "../../target"
import { Ability } from "./types"
import { DiscreteTargetGroup, DiscreteTargetGroupPayload, DiscreteTargetGroupPayloadResolution } from "./types"

// for clarity
// ability -> steps[] -> payloads[] where steps are a DiscreteTargetGroup (ex: all substeps target the same guy(s))

// from the perspective of the source
type Participants = {
    enemy: Actor2[],
    ally: Actor2[],
}

const resolveAbility = (
    p: Participants, source: Actor2, ability: Ability
) => {
    const resolutions: DiscreteTargetGroupPayloadResolution[] = []
    for (let step of ability.steps) {
        resolutions.push(
            ...resolveStep(p, source, step)
        )
    }

    return resolutions
}

// ex: a DiscreteTargetGroup
const resolveStep = (p: Participants, source: Actor2, step: DiscreteTargetGroup) => {
    const resolutions: DiscreteTargetGroupPayloadResolution[] = []
    const targets = target(p.enemy, p.ally, step.tp)
    for (let t of targets) {
        for (let payload of step.payload) {
            const result = resolvePayload(source, t, payload)
            resolutions.push(result)
        }
    }

    return resolutions
}

// ex: resolve DiscreteTargetGroupPayload
const resolvePayload = (
    source: Actor2,
    target: Actor2,
    payload: DiscreteTargetGroupPayload,
): DiscreteTargetGroupPayloadResolution => {
    if (payload.dc) {
        // do a save and stuff
    }
    // succeed
    return {
        ...payload.onSuccess(source, target),
        source,
        target,
        type: 'success',
    }
}

// simulate would handle doing things like applyDamage since that's all mutation