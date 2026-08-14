import { Actor2, OwnerMaximal } from '..'
import { Ability, AbilityCastType, AbilityModNode, advanceAbilityCategoryIndex } from '../../ability-sheet2'
import { selectAndPrepAbility } from './ability'
import { outputRawSar, StandardActionResult } from './attack'

export { FinalStandardActionResult, StandardActionResult, calculateAc, calculateAttack, calculateCritConfirm, calculateSAR, critDidConfirm, hitDidConfirm, outputFinalSar, outputRawSar, sarAgainstTarget } from './attack'

export { generateAbilityModNodes, handleAbilityModNodes, selectAndPrepAbility } from './ability'

/* export const actionIsAbilityModNode = (
    a: StandardActionResult | AbilityModNode
): a is AbilityModNode => {
    if ('payload' in a) return true
    return false
} */
export const actionIsAbility = (
    a: StandardActionResult | Ability
): a is Ability => {
    if ('castType' in a) return true
    return false
}


export const act = (actor: Actor2) => {
    // figure out what this guy is going to do (before resolving it)

    const actions: Array<StandardActionResult | Ability> = []

    for (let key of ['swift', 'standard', 'free'] as AbilityCastType[]) {
        const ab = selectAndPrepAbility(actor, key)
        if (ab !== undefined) actions.push(ab)
        else if (key === 'standard') actions.push(...outputRawSar(actor))

        advanceAbilityCategoryIndex(actor.owner, key)
    }

    return actions
}