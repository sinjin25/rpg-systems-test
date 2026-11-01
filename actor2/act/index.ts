import { Actor2 } from '../types'
import { AbilityCastType } from '../../ability-sheet2/types'
import { AbilitySheetDefinition } from '../../ability-sheet2/abilities2/types'
import { AttackAbilitySheetDefinition } from '../../ability-sheet2/attack-ability/types'
import { advanceAbilityCategoryIndex } from '../../ability-sheet2'
import { ModNodeOpts } from '../../log2/types'
import { selectAndPrepAbility } from './ability'
import { outputRawSar } from './attack'
import { Action } from './types'

export { SAR_AGAINST_TARGET_DEFAULT_OPTS, calculateAc, calculateAttack, calculateCritConfirm, calculateSAR, critDidConfirm, hitDidConfirm, outputFinalSar, outputRawSar, sarAgainstTarget } from './attack'

export { applyResolutions, applyAttackResolutions, selectAndPrepAbility } from './ability'

export type { Action, FinalStandardActionResult, StandardActionResult } from './types'

// both definition kinds carry a castType, so the `kind` discriminant separates them
export const actionIsAttackAbility = (
    a: Action
): a is AttackAbilitySheetDefinition => 'castType' in a && a.kind === 'attack'

export const actionIsAbility = (
    a: Action
): a is AbilitySheetDefinition => 'castType' in a && a.kind !== 'attack'


export const act = (actor: Actor2, opts: ModNodeOpts = {}) => {
    // figure out what this guy is going to do (before resolving it)

    const actions: Action[] = []

    for (let key of ['swift', 'standard', 'free'] as AbilityCastType[]) {
        const ab = selectAndPrepAbility(actor, key)
        if (ab !== undefined) actions.push(ab)
        else if (key === 'standard') actions.push(...outputRawSar(actor, opts))

        advanceAbilityCategoryIndex(actor.owner, key)
    }

    return actions
}