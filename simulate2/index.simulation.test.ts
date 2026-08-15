import { createDefaultOwner } from '../actor2/index.ts'
import { simulateFight } from './index.ts'
import { describe, test, assert } from 'vitest'
import newTimeTravelLogReplayer from '../time-travel2/replay/index.ts'
import ttrvTextVisualizer from '../time-travel2/replay/text-visualizer.ts'
import { StatusEffect } from '../status-sheet2/index.ts'
import { Handlers } from '../time-travel2/types.ts'
import { addAbility } from '../ability-sheet2/index.ts'
import { default as igniteAbility } from '../ability-sheet2/abilities2/ignite.ts'
import { leaf } from '../log2/index.ts'

describe('Integration: TimeTravel', () => {
    test('Works with a ttr passed', async () => {
        const igniteAbilityOwner = createDefaultOwner()
        addAbility(igniteAbilityOwner, igniteAbility)
        /* console.log('igniteAbilityOwner', igniteAbilityOwner.as) */

        const onFireEnemy = createDefaultOwner()
        // add second for more testing
        const poison: StatusEffect = {
            broadContexts: {},
            displayName: 'poison',
            description: '',
            tick: {
                calculateDamage: () => leaf('poison', 2)
            }
        }
        onFireEnemy.ss['poison'] = poison
        const ttr = newTimeTravelLogReplayer(ttrvTextVisualizer)
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
        const EXPECTED_LOG_TYPES: Array<keyof Handlers> = ['act-start', 'damage-over-time-taken', 'ability', 'fight-start', 'speed', 'standard-action-result', 'team-victory']
        for (let log of EXPECTED_LOG_TYPES) {
            const f = ttr.logs.find(a => a.kind === log)
            /* console.log('checking', log, f) */
            assert.exists(f)
        }
        // this can timeout vitest
        await ttr.playback()
    })
})
