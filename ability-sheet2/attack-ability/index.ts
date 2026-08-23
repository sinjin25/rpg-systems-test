import { Actor2 } from '../../actor2'
import { calculateAc, outputRawSar, SAR_AGAINST_TARGET_DEFAULT_OPTS, sarAgainstTarget, StandardActionResult } from '../../actor2/act'
import newModNode, { sumFunc } from '../../log2'
import target from '../../target'
import { Participants } from '../abilities2'
import { AttackAbility, AttackDiscreteTargetGroup, AttackDiscreteTargetGroupPayload, AttackDiscreteTargetGroupPayloadResolution, SARAgainstTargetOpts } from './types'

const resolveAttackAbility = (
    p: Participants, source: Actor2, ability: AttackAbility
) => {
    const resolutions: AttackDiscreteTargetGroupPayloadResolution[] = []
    // call resolve step
    for (let step of ability.steps) {
        resolutions.push(
            ...resolveStep(p, source, step)
        )
    }

    return resolutions
}

const shouldTGPRContinue = (incoming: {
    defenderSuccess: boolean,
}, payload: AttackDiscreteTargetGroupPayload) => {
    // if the payload is chainOnly and the defender succeeded on defending (a miss), stop
    if (payload.chainOnly && incoming.defenderSuccess) return false
    return true
}

const resolveStep = (
    p: Participants, source: Actor2, step: AttackDiscreteTargetGroup,
) => {
    const resolutions: AttackDiscreteTargetGroupPayloadResolution[] = []
    const targets = target(p.enemy, p.ally, step.tp)
    for (let t of targets) {
        if (!t) continue
        for (let payload of step.payload) {
            const { defenderSuccess, result } = resolvePayload(source, t, payload, payload.opts)
            resolutions.push(result)

            if (!shouldTGPRContinue({ defenderSuccess }, payload)) break
        }
    }

    return resolutions
}
const applyAugments = (
    sar: StandardActionResult,
    augments: AttackDiscreteTargetGroupPayload['augments'],
    source: Actor2,
    target: Actor2,
): StandardActionResult => {
    // its an optional field
    if (!augments) return sar
    const out = { ...sar }
    for (const key of Object.keys(augments) as (keyof typeof augments)[]) {
        const aug = augments[key]
        if (!aug) continue
        let node = out[key]
        if (aug.override) node = aug.override(source, target)
        // there is never a case where override is present and mod is as well
        else if (aug.mod) {
            const modNode = typeof aug.mod === 'function' ? aug.mod(source, target) : aug.mod
            node = newModNode(node.displayName, [...node.children, modNode], sumFunc)
        }
        out[key] = node
    }
    return out
}

// pick the effect for the outcome, with fallthrough: crit/threaten fall back to onHit,
// any missing hook is a no-op.
const resolveHook = (
    payload: AttackDiscreteTargetGroupPayload,
    hook: AttackDiscreteTargetGroupPayloadResolution['hook'],
) => {
    const noop = () => ({})
    switch (hook) {
        case 'onMiss': return payload.onMiss ?? noop
        case 'onHit': return payload.onHit ?? noop
        case 'onThreaten': return payload.onThreaten ?? payload.onHit ?? noop
        case 'onCrit': return payload.onCrit ?? payload.onHit ?? noop
    }
}

// the attack-ability-facing default; aliases the single source of truth in actor2/act
export const RESOLVE_PAYLOAD_DEFAULT_OPTS: SARAgainstTargetOpts = SAR_AGAINST_TARGET_DEFAULT_OPTS

const resolvePayload = (
    source: Actor2,
    target: Actor2,
    payload: AttackDiscreteTargetGroupPayload,
    opts: Partial<SARAgainstTargetOpts> = {},
): {
    defenderSuccess: boolean, // a miss (the defender "made their save")
    result: AttackDiscreteTargetGroupPayloadResolution
} => {
    const optsToUse: SARAgainstTargetOpts = {
        ...RESOLVE_PAYLOAD_DEFAULT_OPTS,
        ...opts,
    }
    // v1: single primary attack (dual-wield/iteratives deferred)
    const [sar] = outputRawSar(source)
    const augmented = applyAugments(sar, payload.augments, source, target)
    const targetAc = calculateAc(target.owner)
    const final = sarAgainstTarget(augmented, targetAc, optsToUse)

    // discriminate the outcome from which nodes sarAgainstTarget kept. A confirmed crit carries
    // critDamageResult (and no plain damageResult), so it must be checked before the miss case.
    let hook: AttackDiscreteTargetGroupPayloadResolution['hook']
    if (final.critDamageResult) hook = 'onCrit'
    else if (final.critConfirmResult) hook = 'onThreaten'
    else if (final.damageResult) hook = 'onHit'
    else hook = 'onMiss'

    const hookPayload = resolveHook(payload, hook)(source, target)

    return {
        defenderSuccess: hook === 'onMiss',
        result: {
            source,
            target,
            hook,
            sar: final,
            ...hookPayload,
        },
    }
}

export { resolveAttackAbility, resolveStep, resolvePayload }
