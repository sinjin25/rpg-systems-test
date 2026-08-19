import { applyOnFightStartFeatHandlers, getOnFightStartFeatHandlers } from './fight-start.ts'
import { describe, test, assert, expect } from 'vitest'
import { Feat2 } from './index.ts'
import { makeWrapper } from '../status-sheet2/index.ts'
import { createDefaultOwner } from '../actor2/index.ts'

const testStatus = makeWrapper({
    displayName: 'testfeatstatus',
    broadContexts: {},
})
const testFeat: Feat2 = {
    broadContexts: {},
    displayName: 'abcdefg',
    onFightStart: () => {
        return testStatus
    }
}

describe('Can get fight start feat handlers', () => {
    test('fight-start', () => {
        const owner = createDefaultOwner({
            fs: {
                testFeat,
            }
        })

        const get = getOnFightStartFeatHandlers(owner)
        applyOnFightStartFeatHandlers(owner, get)

        // key matches feat owner key
        // this should probably be normalized
        // I mean it is normalized but by the status effect dn
        assert.exists(owner.ss['testFeat'])
    })
})