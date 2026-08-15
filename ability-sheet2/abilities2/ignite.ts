import { Actor2 } from '../../actor2'
import { leaf } from '../../log2'
import { ignite as igniteStatus } from '../../status-sheet2/status'
import { AbilitySheetDefinition, DiscreteTargetGroup } from './types'

const displayName = 'ignite'

const factory: AbilitySheetDefinition['factory'] = () => {
    const targetFirstEnemy: DiscreteTargetGroup = {
        tp: {
            filters: [],
            simple: 'first',
            team: 'enemy',
        },
        payload: [
            {
                onSuccess: () => ({
                    damage: [leaf('ignite', 3)],
                }),
            },
            {
                dc: {
                    base: 10,
                    saveType: 'reflex',
                },
                onSuccess: () => ({}),
                onFailure: (source: Actor2) => ({
                    statusEffect: [igniteStatus({ snapshot: source.owner })],
                }),
            },
        ],
    }

    return { steps: [targetFirstEnemy] }
}

export const ignite: AbilitySheetDefinition = {
    castType: 'standard',
    displayName,
    description: 'Deal fire damage; on a failed reflex save the target catches fire',
    factory,
}

export default ignite
