import { Participants, resolveAbility, resolveStep } from './index.ts'
import { describe, test, assert, expect, afterEach } from 'vitest'
import { DiscreteTargetGroup } from './types.ts'
import { ignite } from '../../status-sheet2/index.ts'
import { createDefaultOwner, instantiateActor } from '../../actor2/index.ts'
import { leaf } from '../../log2/index.ts'
import { createRoll } from '../../roll/index.ts'

describe('?:chainOnly DiscreteTargetGroupPayload', () => {
    let shouldProceed
    let hasTriggered
    const chainPayload: DiscreteTargetGroup = {
        tp: {
            filters: [],
            simple: 'first',
            team: 'enemy',
        },
        payload: [
            {
                chainOnly: true,
                dc: {
                    base: 2,
                    saveType: 'reflex',
                },
                onSavePass: () => {
                    shouldProceed = false
                    return {}
                },
                onSaveFailure: () => {
                    shouldProceed = true
                    return {}
                }
            },
            {
                onSavePass: () => {
                    hasTriggered = true
                    return {}
                },
                onSaveFailure: () => {
                    hasTriggered = true
                    return {}
                },
            }
        ]
    }
    afterEach(() => {
        shouldProceed = undefined
        hasTriggered = undefined
    })
    test('Chains on success', () => {
        const ri = createRoll(2)
        const alwaysFail = createDefaultOwner({
            cs: { dex: -999 }
        })

        const caster = createDefaultOwner()
        const alwaysFailA = instantiateActor(alwaysFail, false, { rollInstance: ri })
        const casterA = instantiateActor(caster, false, { rollInstance: ri })

        assert.isUndefined(shouldProceed)
        assert.isUndefined(hasTriggered)

        const result = resolveStep({
            ally: [casterA],
            enemy: [alwaysFailA],
        }, casterA, chainPayload, { rollInstance: ri })

        assert.isTrue(shouldProceed)
        assert.isTrue(hasTriggered)
    })
    test('Stops further payload resolution on save succeed', () => {
        const ri = createRoll(3)
        const alwaysPass = createDefaultOwner({
            cs: { dex: 999 }
        })

        const caster = createDefaultOwner()
        const alwaysPassA = instantiateActor(alwaysPass, false, { rollInstance: ri })
        const casterA = instantiateActor(caster, false, { rollInstance: ri })

        assert.isUndefined(shouldProceed)
        assert.isUndefined(hasTriggered)

        const result = resolveStep({
            ally: [casterA],
            enemy: [alwaysPassA],
        }, casterA, chainPayload, { rollInstance: ri })

        assert.isFalse(shouldProceed)
        console.log('hasTriggered', hasTriggered)
        assert.isTrue(hasTriggered === undefined)
    })
})