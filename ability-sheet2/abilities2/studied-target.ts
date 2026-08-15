import { studiedTarget as stStatus } from '../../status-sheet2/status'
import { AbilitySheetDefinition, DiscreteTargetGroup } from './types'

const displayName = 'Studied Target'

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
                    statusEffect: [stStatus],
                }),
            },
        ],
    }

    return { steps: [targetFirstEnemy] }
}

export const studiedTarget: AbilitySheetDefinition = {
    castType: 'free',
    displayName,
    factory,
}

export default studiedTarget
