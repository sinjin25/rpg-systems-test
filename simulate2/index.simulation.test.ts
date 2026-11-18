import { createDefaultOwner } from '../actor2/index.ts'
import { simulateFight } from './index.ts'
import { describe, test, assert } from 'vitest'
import newTimeTravelLogReplayer from '../time-travel2/replay/index.ts'
import ttrvTextAugmenter, { consumeTextAugmentedLogs } from '../time-travel2/replay/text-visualizer.ts'
import { makeWrapper } from '../status-sheet2/index.ts'
import { inst } from '../status-sheet2/testing.ts'
import { Handlers } from '../time-travel2/types.ts'
import { addAbility } from '../ability-sheet2/index.ts'
import { default as igniteAbility } from '../ability-sheet2/abilities2/ignite.ts'
import { leaf } from '../log2/index.ts'
import { deriveFeatKey, rage } from '../feat2/registry.ts'
import { deserializeStatusEffect } from '../time-travel2/serialize/status-effect.ts'

describe('Integration: TimeTravel', () => {
    test('Works with a ttr passed', async () => {
        const igniteAbilityOwner = createDefaultOwner({
            fs: {
                [deriveFeatKey(rage)]: rage,
            }
        })
        addAbility(igniteAbilityOwner, igniteAbility)

        const onFireEnemy = createDefaultOwner()
        const ttr = newTimeTravelLogReplayer(ttrvTextAugmenter)
        simulateFight(
            {
                enemy: [onFireEnemy],
                player: [igniteAbilityOwner],
            },
            {
                timeTravelReplayer: ttr,
            }
        )
        assert.isTrue(ttr.logs.length > 2)
        const EXPECTED_LOG_TYPES: Array<keyof Handlers> = ['act-start', 'damage-over-time-taken', 'ability', 'fight-start', 'speed', 'standard-action-result', 'team-victory',
            // only passed if a relevant feat is provided
            'pre-fight-feat-applied',
            'post-fight']
        for (let log of EXPECTED_LOG_TYPES) {
            const f = ttr.logs.find(a => a.kind === log)
            assert.exists(f)
        }
        const augmented = ttr.playback()
        await consumeTextAugmentedLogs(augmented)
    })
})

describe('Integration: TimeTravel - status outside the static registry', () => {
    test('a status built outside status-sheet2/registry.ts comes back undefined on deserialize, and only resolves with a manually supplied fallback', () => {
        const player = createDefaultOwner()
        const onFireEnemy = createDefaultOwner()

        // never added to status-sheet2/registry.ts - this is what a one-off status built
        // by rpg-content or a test, rather than the shared registry, looks like
        const poison = makeWrapper({
            id: 'poison',
            broadContexts: {},
            displayName: 'poison',
            description: '',
            tick: {
                calculateDamage: {
                    base: () => leaf('poison', 2),
                    mod: () => leaf('poison-mod', 0),
                }
            }
        })
        onFireEnemy.ss['poison'] = [inst(poison, onFireEnemy)]

        const ttr = newTimeTravelLogReplayer()
        simulateFight(
            {
                enemy: [onFireEnemy],
                player: [player],
            },
            {
                timeTravelReplayer: ttr,
            }
        )

        const dot = ttr.logs.find(a => a.kind === 'damage-over-time-taken')
        assert.exists(dot)
        if (dot?.kind !== 'damage-over-time-taken') throw Error('expected a damage-over-time-taken log')

        // poison is not in registry so it can't recreate from the id
        assert.isUndefined(deserializeStatusEffect(dot.statusSource))

        // provide a fallback if necessary for testing
        // however, this is not available to pass in when using it through deserializeOwner 11-18-2026
        assert.equal(deserializeStatusEffect(dot.statusSource, { poison })?.displayName, 'poison')
    })
})
