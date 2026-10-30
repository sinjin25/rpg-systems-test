import { getAbilityKey } from './index'
import ignite from './abilities2/ignite'
import studiedTarget from './abilities2/studied-target'
import normalAttack from './attack-ability/normal-attack'
import { AbilityIdsTest, AnyAbilitySheetDefinition } from './types'

export const registry = {
    [getAbilityKey(ignite)]: ignite,
    [getAbilityKey(studiedTarget)]: studiedTarget,
    [getAbilityKey(normalAttack)]: normalAttack,
    // do not include the test ability doALot
} satisfies Record<AbilityIdsTest, AnyAbilitySheetDefinition>

export {
    ignite,
    studiedTarget,
    normalAttack,
}

export default registry
