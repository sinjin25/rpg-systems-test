import { Actor2, OwnerMaximal } from "../../actor2"
import newModNode, { sumFunc } from "../../log2"
import roll from "../../log2/roll"
import { save } from "../../log2/terminal"
import dc from "../../log2/terminal/dc"
import target from "../../target"
import { Ability } from "./types"
import { DiscreteTargetGroup, DiscreteTargetGroupPayload, DiscreteTargetGroupPayloadResolution } from "./types"

// for clarity
// ability -> steps[] -> payloads[] where steps are a DiscreteTargetGroup (ex: all substeps target the same guy(s))

// from the perspective of the source
export type Participants = {
    enemy: Actor2[],
    ally: Actor2[],
}

export const resolveAbility = (
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

const shouldTGPRContinue = (incoming: {
    defenderSuccess: boolean,
}, payload: DiscreteTargetGroupPayload) => {
    // if the payload is chainOnly and the defender succeeded on defending, stop
    if (payload.chainOnly && incoming.defenderSuccess) return false
    return true
}

// ex: a DiscreteTargetGroup
export const resolveStep = (p: Participants, source: Actor2, step: DiscreteTargetGroup) => {
    const resolutions: DiscreteTargetGroupPayloadResolution[] = []
    const targets = target(p.enemy, p.ally, step.tp)
    for (let t of targets) {
        for (let payload of step.payload) {
            const { defenderSuccess, result } = resolvePayload(source, t, payload)
            resolutions.push(result)

            if (!shouldTGPRContinue({ defenderSuccess }, payload)) break
        }
    }

    return resolutions
}

// ex: resolve DiscreteTargetGroupPayload
const resolvePayload = (
    source: Actor2,
    target: Actor2,
    payload: DiscreteTargetGroupPayload,
): {
    defenderSuccess: boolean,
    result: DiscreteTargetGroupPayloadResolution,
} => {
    if (payload.dc) {
        // do a save and stuff
        const endDc = dc({
            baseDc: payload.dc.base,
            tags: [], // unused for now
        })(source.owner)
        const endSave = newModNode(
            payload.dc.saveType,
            [save(payload.dc.saveType)(target.owner), roll(20, 1)(target.owner)],
            sumFunc
        )

        const saveSucceeded = endSave.total() >= endDc.total()
        if (saveSucceeded) return {
            defenderSuccess: true,
            result: {
                ...(payload.onSavePass?.(source, target) ?? {}),
                source,
                target,
                type: 'success',
                save: endSave,
                saveType: payload.dc.saveType,
                dc: endDc,
            }
        }
        return {
            defenderSuccess: false,
            result: {
                ...payload.onSaveFailure(source, target),
                source,
                target,
                type: 'failure',
                save: endSave,
                saveType: payload.dc.saveType,
                dc: endDc,
            }
        }
    }
    // no dc: the effect always lands
    return {
        defenderSuccess: false,
        result: {
            ...payload.onSaveFailure(source, target),
            source,
            target,
            type: 'success',
        }
    }
}

// simulate would handle doing things like applyDamage since that's all mutation