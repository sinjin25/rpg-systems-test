import { Actor2, OwnerMaximal } from ".."
import { BaseEquipment } from "../../equipment-sheet2/types"
import newModNode, { findNodeMatching, leaf, ModNode, sumFunc } from "../../log2"
import { ac, attack, critConfirm, critDamage, critThreatRange, damage } from "../../log2/terminal"
import roll from "../../log2/roll"
import modNodeToText from "../../log2/format"
import type { SARAgainstTargetOpts } from "../../ability-sheet2/attack-ability/types"

type AttackOpts = {
    relevantSlot: BaseEquipment,
}

export const calculateAttack = (
    owner: OwnerMaximal,
    opts: AttackOpts
) => {
    owner.relevantSlot = opts.relevantSlot

    return newModNode(
        'attack',
        [attack(owner), roll(20, 1, 'attack-sides-mod')(owner)],
        sumFunc,
    )
}

const calculateDamage = (
    owner: OwnerMaximal,
    opts: AttackOpts
) => {
    owner.relevantSlot = opts.relevantSlot

    return damage(owner)
}

const calculateCritDamage = (
    owner: OwnerMaximal,
    opts: AttackOpts
) => {
    owner.relevantSlot = opts.relevantSlot

    return critDamage(owner)
}

const calculateThreat = (
    owner: OwnerMaximal,
    opts: AttackOpts
) => {
    return critThreatRange(owner)
}

export const calculateCritConfirm = (
    owner: OwnerMaximal,
    opts: AttackOpts
) => {
    owner.relevantSlot = opts.relevantSlot

    return newModNode(
        'crit-confirm',
        [critConfirm(owner), roll(20, 1, 'attack-sides-mod')(owner)],
        sumFunc,
    )
}

export const calculateAc = (
    owner: OwnerMaximal
) => {
    return ac(owner)
}

export type StandardActionResult = {
    relevantSlot: BaseEquipment,
    attackResult: ReturnType<typeof calculateAttack>,
    damageResult: ReturnType<typeof calculateDamage>,
    threatResult: ReturnType<typeof calculateThreat>,
    critConfirmResult: ReturnType<typeof calculateCritConfirm>,
    critDamageResult: ReturnType<typeof calculateCritDamage>,
}

export type FinalStandardActionResult = Partial<StandardActionResult> & {
    acResult: ReturnType<typeof calculateAc>,
    relevantSlot: BaseEquipment,
}

export const calculateSAR = (
    data: {
        relevantSlot: BaseEquipment,
        owner: OwnerMaximal,
    }
): StandardActionResult => {
    const { owner, relevantSlot } = data
    return {
        attackResult: calculateAttack(owner, {
            relevantSlot,
        }),
        critConfirmResult: calculateCritConfirm(owner, {
            relevantSlot,
        }),
        critDamageResult: calculateCritDamage(owner, {
            relevantSlot,
        }),
        damageResult: calculateDamage(owner, {
            relevantSlot,
        }),
        threatResult: calculateThreat(owner, {
            relevantSlot,
        }),
        relevantSlot,
    }
}

// before the target is considered, once the target is considered irrelavant calcs will be stripped
export const outputRawSar = (data: Actor2) => {
    let attackType: 'mainhand' | 'twohand' | 'dual-wield'
    if (data.owner.es.twohanded) attackType = 'twohand'
    else if (data.owner.es.offhand?.broadContexts?.damage) attackType = 'dual-wield'
    else attackType = 'mainhand'

    const sar: StandardActionResult[] = []
    switch (attackType) {
        case 'twohand':
            sar.push(calculateSAR({
                owner: data.owner,
                relevantSlot: data.owner.es.twohanded!
            }))
            break
        case 'dual-wield':
            sar.push(calculateSAR({
                owner: data.owner,
                relevantSlot: data.owner.es.mainhand!
            }))
            sar.push(calculateSAR({
                owner: data.owner,
                relevantSlot: data.owner.es.offhand!
            }))
            break
        case 'mainhand':
        default:
            sar.push(calculateSAR({
                owner: data.owner,
                relevantSlot: data.owner.es.mainhand!
            }))
    }

    return sar
}

// all-true = the standard Pathfinder rules; the single source of truth for the default flags. The
// raw-attack path (outputFinalSar) and existing callers get this, so behaviour is unchanged unless a
// caller passes overrides (see the attack-ability resolvePayload).
export const SAR_AGAINST_TARGET_DEFAULT_OPTS: SARAgainstTargetOpts = {
    canMiss: true,
    canCrit: true,
    mustCrit: false,
    nat1HitFails: true,
    nat20HitHits: true,
    nat1ThreatFails: true,
    nat20ThreatSucceeds: true,
}

export const hitDidConfirm = (
    attackResult: ReturnType<typeof calculateAttack>,
    targetAc: ReturnType<typeof calculateAc>,
    opts: SARAgainstTargetOpts = SAR_AGAINST_TARGET_DEFAULT_OPTS,
) => {
    const rollChild = attackResult.children.find(a => a.displayName === 'roll-total')
    if (!rollChild) {
        throw Error('Did not find roll child. Confirm the name.')
    }

    const roll = rollChild.total()
    if (opts.nat20HitHits && roll >= 20) return true
    if (opts.nat1HitFails && roll === 1) return false
    return attackResult.total() >= targetAc.total()
}

export const critDidConfirm = (
    critConfirmResult: ReturnType<typeof calculateCritConfirm>,
    targetAc: ReturnType<typeof calculateAc>,
    opts: SARAgainstTargetOpts = SAR_AGAINST_TARGET_DEFAULT_OPTS,
) => {
    const rollChild = critConfirmResult.children.find(a => a.displayName === 'roll-total')
    if (!rollChild) {
        throw Error('Did not find roll child. Confirm the name.')
    }

    const roll = rollChild.total()
    if (opts.nat20ThreatSucceeds && roll >= 20) return true
    if (opts.nat1ThreatFails && roll === 1) return false
    return critConfirmResult.total() >= targetAc.total()
}

export const sarAgainstTarget = (
    sar: StandardActionResult,
    targetAc: ReturnType<typeof calculateAc>,
    opts: SARAgainstTargetOpts = SAR_AGAINST_TARGET_DEFAULT_OPTS,
): FinalStandardActionResult => {
    const { attackResult, critConfirmResult, critDamageResult, damageResult, relevantSlot, threatResult } = sar

    const rollChild = attackResult.children.find(a => a.displayName === 'roll-total')
    if (!rollChild) {
        throw Error('Did not find roll child. Confirm the name.')
    }

    // Does it hit - mustCrit forces everything; canMiss:false forces a landing
    const isHit = opts.mustCrit ? true : (opts.canMiss ? hitDidConfirm(attackResult, targetAc, opts) : true)

    // is it a threat - canCrit:false forecloses any crit
    const isThreat = opts.mustCrit ? true : (opts.canCrit ? rollChild.total() >= threatResult.total() : false)

    // did it confirm
    let isConfirm = opts.mustCrit ? true : (isThreat && critDidConfirm(critConfirmResult, targetAc, opts))

    // what to return
    if (!isHit) {
        // no hit, no damage
        return {
            acResult: targetAc,
            attackResult,
            relevantSlot,
        }
    }
    if (!isThreat) {
        // hit, damage, threat
        return {
            acResult: targetAc,
            attackResult,
            threatResult,
            damageResult,
            relevantSlot,
        }
    }
    if (!isConfirm) {
        // hit, damage, threat, confirm roll
        return {
            acResult: targetAc,
            attackResult,
            threatResult,
            critConfirmResult,
            damageResult,
            relevantSlot
        }
    }
    else {
        // hit, threat, confirm roll, scaled damage
        return {
            acResult: targetAc,
            attackResult,
            threatResult,
            critConfirmResult,
            critDamageResult,
            relevantSlot
        }
    }
}

export const outputFinalSar = (
    sar: StandardActionResult[],
    target: Actor2,
) => {
    const targetAc = calculateAc(target.owner)

    const finalSar: FinalStandardActionResult[] = sar.map((mySar) => sarAgainstTarget(mySar, targetAc))

    return finalSar
}