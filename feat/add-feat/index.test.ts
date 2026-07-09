import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { FeatSheet } from '../types.ts'
import { addFeat } from './index.ts'
import { describe, test, assert } from 'vitest'

describe('feat prerequisites', () => {
    test('feats with no prerequisites always report met', () => {
        const fs: FeatSheet = {}

        const metC = addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoC' })
        const metD = addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoD' })

        assert.equal(metC, true)
        assert.equal(metD, true)
    })

    test('reports unmet prerequisites but still grants the feat', () => {
        const fs: FeatSheet = {}

        const metB = addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoB' })

        assert.equal(metB, false)
        assert.exists(fs.featPrereqDemoB)
    })

    test('reports met prerequisites once the required feats are owned', () => {
        const fs: FeatSheet = {}

        addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoC' })
        addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoD' })
        const metB = addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoB' })

        assert.equal(metB, true)
    })

    test('chained prerequisites (A requires B requires C and D)', () => {
        const fs: FeatSheet = {}

        const metAEarly = addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoA' })
        assert.equal(metAEarly, false)

        addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoC' })
        addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoD' })
        addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoB' })
        const metALater = addFeat({ cs: defaultCharacterSheet, fs }, { key: 'featPrereqDemoA' })

        assert.equal(metALater, true)
    })

    test('OR prerequisite: feat C, feat D, or high str each independently satisfy it', () => {
        const lowStrCs = { ...defaultCharacterSheet, str: 10 }

        // via feat C alone
        const fsC: FeatSheet = {}
        addFeat({ cs: lowStrCs, fs: fsC }, { key: 'featPrereqDemoC' })
        const metViaC = addFeat({ cs: lowStrCs, fs: fsC }, { key: 'featPrereqDemoRequiresCOrDorStr' })
        assert.equal(metViaC, true)

        // via feat D alone
        const fsD: FeatSheet = {}
        addFeat({ cs: lowStrCs, fs: fsD }, { key: 'featPrereqDemoD' })
        const metViaD = addFeat({ cs: lowStrCs, fs: fsD }, { key: 'featPrereqDemoRequiresCOrDorStr' })
        assert.equal(metViaD, true)

        // via str alone (neither C nor D owned)
        const highStrCs = { ...defaultCharacterSheet, str: 15 }
        const fsStr: FeatSheet = {}
        const metViaStr = addFeat({ cs: highStrCs, fs: fsStr }, { key: 'featPrereqDemoRequiresCOrDorStr' })
        assert.equal(metViaStr, true)

        // none of the three: fails
        const fsNone: FeatSheet = {}
        const metNone = addFeat({ cs: lowStrCs, fs: fsNone }, { key: 'featPrereqDemoRequiresCOrDorStr' })
        assert.equal(metNone, false)
    })
})
