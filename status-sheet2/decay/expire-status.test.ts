import { StatusEffect } from '..'
import { createDefaultOwner } from '../../actor2'
import { expireStatus } from './expire-status'
import { describe, test, assert } from 'vitest'

describe('expireStatus', () => {
    const plainStatus = (displayName = 'plain'): StatusEffect => ({
        displayName,
        broadContexts: {},
    })

    test('removes the status from the sheet', () => {
        const owner = createDefaultOwner({
            ss: {
                test: plainStatus()
            }
        })

        assert.exists(owner.ss.test)
        expireStatus(owner, 'test')
        assert.notExists(owner.ss.test)
    })

    test('returns the status it expired', () => {
        const status = plainStatus()
        const owner = createDefaultOwner({
            ss: {
                test: status
            }
        })

        assert.equal(expireStatus(owner, 'test'), status)
    })

    test('returns undefined when the key is not on the sheet', () => {
        const owner = createDefaultOwner()

        assert.notExists(expireStatus(owner, 'test'))
    })

    test('does not run onExpiration', () => {
        let ran = false
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...plainStatus(),
                    onExpiration: () => {
                        ran = true
                        return plainStatus('follow up')
                    },
                }
            }
        })

        expireStatus(owner, 'test')
        assert.isFalse(ran)
        assert.notExists(owner.ss.test)
    })

    test('does not touch other statuses on the sheet', () => {
        const other = plainStatus('other')
        const owner = createDefaultOwner({
            ss: {
                test: plainStatus(),
                other,
            }
        })

        expireStatus(owner, 'test')
        assert.notExists(owner.ss.test)
        assert.equal(owner.ss.other, other)
    })
})
