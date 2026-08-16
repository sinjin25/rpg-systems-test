import { addStatusToStatusSheet, getStatusKey, StatusEffect } from '..'
import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import { chainStatus } from './chain-status'
import { expireStatus } from './expire-status'
import { DecayChainStatusLog, DecayOwner } from './types'
import { describe, test, assert, expect } from 'vitest'

describe('chainStatus', () => {
    const stFollowup: StatusEffect = {
        displayName: 'st2',
        broadContexts: {},
    }
    const st: StatusEffect = {
        broadContexts: {},
        displayName: 'st1',
        onExpiration: (o: OwnerMaximal) => stFollowup
    }

    test('chainStatus doesnt actually know if the original status was on owner', () => {
        // this function is intended to follow up expire-status.ts
        const owner = createDefaultOwner()
        assert.notExists(owner.ss[getStatusKey(st)])
        const log = chainStatus(owner, st)
        assert.exists(owner.ss, log!.key)
    })

    test('chainStatus returns a log on success or undefined when nothing happens', () => {
        const owner = createDefaultOwner()
        const log = chainStatus(owner, st)
        assert.exists(log)
        expect(log).toMatchObject({
            key: getStatusKey(stFollowup),
            kind: 'replaced',
            source: st,
        } as DecayChainStatusLog)

        const undefSt: StatusEffect = {
            displayName: 'undefSt',
            broadContexts: {},
        }
        const undefLog = chainStatus(owner, undefSt)
        assert.equal(undefLog, undefined)
    })

    test('chaining puts follow-up status on the sheet under its own displayName', () => {
        const followUp = stFollowup
        const owner = createDefaultOwner()

        chainStatus(owner, st)
        assert.equal(owner.ss[getStatusKey(followUp)], followUp)
        assert.notExists(owner.ss['original'])
    })

    test('passes the owner to onExpiration', () => {
        let seen: unknown = undefined
        const owner = createDefaultOwner()

        assert.notEqual(seen, owner)
        chainStatus(owner, {
            ...st,
            onExpiration: (data) => {
                seen = data
                return undefined
            },
        })
        assert.equal(seen, owner)
    })

    test('Does nothing when onExpiration returns undefined', () => {
        const owner = createDefaultOwner()

        const normalStatus: StatusEffect = {
            displayName: 'normalstatus',
            broadContexts: {},
            onExpiration: undefined,
        }
        chainStatus(owner, normalStatus)
        assert.deepEqual(Object.keys(owner.ss), [])
    })

    test('does nothing when the status has no onExpiration', () => {
        const owner = createDefaultOwner()

        const normalStatus: StatusEffect = {
            displayName: 'normalstatus',
            broadContexts: {},
            // onExpiration: undefined,
        }

        const next = chainStatus(owner, normalStatus)
        assert.deepEqual(Object.keys(owner.ss), [])
        assert.notExists(next)
    })

    test('does nothing when handed no status', () => {
        const owner = createDefaultOwner()

        const next = chainStatus(owner, undefined)
        assert.deepEqual(Object.keys(owner.ss), [])
        assert.notExists(next)
    })

    test('chained off expireStatus, onExpiration sees the status already removed', () => {
        let existedDuringCallback: boolean | undefined = undefined
        const owner = createDefaultOwner()
        const testStatus: StatusEffect = {
            displayName: 'test',
            broadContexts: {},
            onExpiration: () => {
                existedDuringCallback = 'test' in owner.ss
                return undefined
            },
        }
        addStatusToStatusSheet(owner, testStatus)

        chainStatus(owner, expireStatus(owner, 'test'))
        assert.equal(existedDuringCallback, false)
    })
})