import { describe, test, assert } from 'vitest'
import { StoredLog } from './types'
import ttrvJsonAugmenter from './json-augmenter.ts'
import { createDefaultOwner, instantiateActor } from '../../actor2/index.ts'
import snapshotActor from '../snapshot/actor.ts'

const aSARLog = (): StoredLog<'standard-action-result'> => ({
    kind: 'standard-action-result',
    modNodes: {},
    source: snapshotActor(instantiateActor(createDefaultOwner())),
})

const anActStartLog = (): StoredLog<'act-start'> => ({
    kind: 'act-start',
    source: snapshotActor(instantiateActor(createDefaultOwner())),
})

describe('ttrvJsonAugmenter', () => {
    // live function values (ex: equipment broadContexts) don't survive JSON and
    // don't need to - C# doesn't call them either. Compare against the log's own
    // JSON-safe projection rather than the raw log.
    test('round-trips a standard-action-result log through JSON unchanged', () => {
        const log = aSARLog()
        const json = ttrvJsonAugmenter['standard-action-result'](log)
        assert.typeOf(json, 'string')
        assert.deepEqual(JSON.parse(json), JSON.parse(JSON.stringify(log)))
    })

    test('round-trips an act-start log through JSON unchanged', () => {
        const log = anActStartLog()
        const json = ttrvJsonAugmenter['act-start'](log)
        assert.deepEqual(JSON.parse(json), JSON.parse(JSON.stringify(log)))
    })
})
