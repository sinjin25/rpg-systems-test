import { TimeTravelLog } from '../types'
import newTimeTravelLogReplayer from './index.ts'
import { describe, test, assert } from 'vitest'

// a minimal valid log (modNodes is a Partial, so {} is fine) - contents don't matter here,
// these tests only exercise the cursor/stepping behavior.
const aSARLog = (): TimeTravelLog => ({ kind: 'standard-action-result', modNodes: {} })

describe('newTimeTravelLogReplayer', () => {
    test('replays null -> a log -> null as the cursor runs out', () => {
        const replayer = newTimeTravelLogReplayer()

        // nothing appended yet: stepping returns null
        assert.equal(replayer.replayStep(), null)

        // append one log: the next step plays it back
        const log = aSARLog()
        replayer.appendLog(log)
        assert.equal(replayer.replayStep(), log)

        // out of logs again: back to null
        assert.equal(replayer.replayStep(), null)
    })
})
