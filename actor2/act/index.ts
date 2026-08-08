import { Actor2, OwnerMaximal } from '..'
import { AbilityCastType, AbilityModNode, advanceAbilityCategoryIndex } from '../../ability-sheet2'
import { selectAndPrepAbility } from './ability'
import { outputRawSar, StandardActionResult } from './attack'

export { FinalStandardActionResult, StandardActionResult, calculateAc, calculateAttack, calculateCritConfirm, calculateSAR, critDidConfirm, hitDidConfirm, outputFinalSar, outputRawSar, sarAgainstTarget } from './attack'

export { generateAbilityModNodes, handleAbilityModNodes, selectAndPrepAbility } from './ability'

export const act = (actor: Actor2) => {
    // figure out what this guy is going to do (before resolving it)

    const actions: Array<StandardActionResult | AbilityModNode> = []

    for (let key of ['swift', 'standard', 'free'] as AbilityCastType[]) {
        const gamn = selectAndPrepAbility(actor, key)
        if (gamn !== undefined) actions.push(...gamn)
        else if (key === 'standard') actions.push(...outputRawSar(actor))

        advanceAbilityCategoryIndex(actor.owner, key)
    }

    return actions
}