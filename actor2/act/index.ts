import { Actor2 } from '..'
import { AbilityCastType, AbilitySheetDefinition, AttackAbilitySheetDefinition, advanceAbilityCategoryIndex } from '../../ability-sheet2'
import { selectAndPrepAbility } from './ability'
import { outputRawSar, StandardActionResult } from './attack'

export { FinalStandardActionResult, StandardActionResult, SAR_AGAINST_TARGET_DEFAULT_OPTS, calculateAc, calculateAttack, calculateCritConfirm, calculateSAR, critDidConfirm, hitDidConfirm, outputFinalSar, outputRawSar, sarAgainstTarget } from './attack'

export { applyResolutions, applyAttackResolutions, selectAndPrepAbility } from './ability'

export type Action = StandardActionResult | AbilitySheetDefinition | AttackAbilitySheetDefinition

// both definition kinds carry a castType, so the `kind` discriminant separates them
export const actionIsAttackAbility = (
    a: Action
): a is AttackAbilitySheetDefinition => 'castType' in a && a.kind === 'attack'

export const actionIsAbility = (
    a: Action
): a is AbilitySheetDefinition => 'castType' in a && a.kind !== 'attack'


export const act = (actor: Actor2) => {
    // figure out what this guy is going to do (before resolving it)

    const actions: Action[] = []

    for (let key of ['swift', 'standard', 'free'] as AbilityCastType[]) {
        const ab = selectAndPrepAbility(actor, key)
        if (ab !== undefined) actions.push(ab)
        else if (key === 'standard') actions.push(...outputRawSar(actor))

        advanceAbilityCategoryIndex(actor.owner, key)
    }

    return actions
}