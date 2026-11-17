import { describe, test, assert } from 'vitest'
import { StoredLog } from './types'
import ttrvJsonAugmenter, { dropStatusInstanceSource } from './json-augmenter.ts'
import { createDefaultOwner, instantiateActor } from '../../actor2/index.ts'
import snapshotActor from '../serialize/actor.ts'

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
    // don't need to - C# doesn't call them either. A status instance's `source` is
    // dropped too (see json-augmenter.ts), so compare against the log's own
    // JSON-safe projection rather than the raw log.
    test('round-trips a standard-action-result log through JSON unchanged', () => {
        const log = aSARLog()
        const json = ttrvJsonAugmenter['standard-action-result'](log)
        assert.typeOf(json, 'string')
        assert.deepEqual(JSON.parse(json), JSON.parse(JSON.stringify(log, dropStatusInstanceSource)))
    })

    test('round-trips an act-start log through JSON unchanged', () => {
        const log = anActStartLog()
        const json = ttrvJsonAugmenter['act-start'](log)
        assert.deepEqual(JSON.parse(json), JSON.parse(JSON.stringify(log, dropStatusInstanceSource)))
    })
})
