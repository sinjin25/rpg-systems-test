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

describe('Integration: TimeTravel', () => {
    test('Works with a ttr passed', async () => {
        const igniteAbilityOwner = createDefaultOwner({
            fs: {
                [deriveFeatKey(rage)]: rage,
            }
        })
        addAbility(igniteAbilityOwner, igniteAbility)
        /* console.log('igniteAbilityOwner', igniteAbilityOwner.as) */

        const onFireEnemy = createDefaultOwner()
        // add second for more testing
        const poison = makeWrapper({
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
            /* console.log('checking', log, f) */
            assert.exists(f)
        }
        const augmented = ttr.playback()
        await consumeTextAugmentedLogs(augmented)
    })
})
