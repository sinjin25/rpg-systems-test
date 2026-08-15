import { Actor2 } from '..'
import { AbilityCastType, AbilitySheetDefinition, advanceAbilityCategoryIndex } from '../../ability-sheet2'
import { selectAndPrepAbility } from './ability'
import { outputRawSar, StandardActionResult } from './attack'

export { FinalStandardActionResult, StandardActionResult, calculateAc, calculateAttack, calculateCritConfirm, calculateSAR, critDidConfirm, hitDidConfirm, outputFinalSar, outputRawSar, sarAgainstTarget } from './attack'

export { applyResolutions, selectAndPrepAbility } from './ability'

export const actionIsAbility = (
    a: StandardActionResult | AbilitySheetDefinition
): a is AbilitySheetDefinition => {
    if ('castType' in a) return true
    return false
}


export const act = (actor: Actor2) => {
    // figure out what this guy is going to do (before resolving it)

    const actions: Array<StandardActionResult | AbilitySheetDefinition> = []

    for (let key of ['swift', 'standard', 'free'] as AbilityCastType[]) {
        const ab = selectAndPrepAbility(actor, key)
        if (ab !== undefined) actions.push(ab)
        else if (key === 'standard') actions.push(...outputRawSar(actor))

        advanceAbilityCategoryIndex(actor.owner, key)
    }

    return actions
}