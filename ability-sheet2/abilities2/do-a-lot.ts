import { Actor2 } from '../../actor2'
import { leaf } from '../../log2'
import { AbilitySheet } from '../types'
import { Ability, AbilityPayload, AbilitySheetDefinition, DiscreteTargetGroup, DiscreteTargetGroupPayload } from './types'

const factory: AbilitySheetDefinition['factory'] = () => {
    const selfTarget: DiscreteTargetGroup = {
        tp: {
            filters: [],
            simple: 'first',
            team: 'ally',
        },
        payload: [
            {
                onSuccess: (s: Actor2, t: Actor2) => {
                    let heal = 10
                    if (t.owner.cs.dex <= 10) heal *= 2
                    return {
                        heal: [leaf('demoDoALot', heal)]
                    }
                }
            },
        ]
    }
    const targetFirst: DiscreteTargetGroup = {
        tp: {
            filters: [],
            simple: 'first',
            team: 'enemy'
        },
        payload: [{
            dc: {
                base: 17,
                saveType: 'will',
            }, // hard dc
            onFailure: () => {
                return {
                    statusEffect: [/* whatever here */]
                }
            },
            onSuccess: (s: Actor2, t: Actor2) => ({}) // do nothing
        },
        {
            onSuccess: (s: Actor2, t: Actor2) => {
                return {
                    damage: [leaf('demoDoALot', 10)]
                }
            }
        }]
    }
    const splash: DiscreteTargetGroup = {
        tp: {
            filters: [],
            simple: 'all',
            team: 'enemy'
        },
        payload: [{
            dc: {
                base: 10,
                saveType: 'reflex',
            }, // easy dc
            onFailure: (s: Actor2, t: Actor2) => {
                return {
                    statusEffect: [/* whatever here */]
                }
            },
            onSuccess: (s: Actor2, t: Actor2) => ({}) // do nothing}]
        },
        ]
    }
    return {
        steps: [
            selfTarget,
            targetFirst,
            splash,
        ]
    }
}

export const doALot: AbilitySheetDefinition = {
    castType: 'standard',
    displayName: 'testAbility: do a lot',
    description: 'An ability with a lot of steps and a lot of targets',
    factory,
}

export default doALot