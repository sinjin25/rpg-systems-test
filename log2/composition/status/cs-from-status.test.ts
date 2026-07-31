import bearsEndurance from '../../../status-sheet2/status/bears-endurance.ts'
import bullsStrength from '../../../status-sheet2/status/bulls-strength'
import catsGrace from '../../../status-sheet2/status/cats-grace'
import { createDefaultOwner } from '../../defaults'
import { findNodeMatching } from '../../index.ts'
import csFromStatus from './cs-from-status.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Works', () => {
    test('str-from-status, dex-from-status, con-from-status', () => {
        const owner = createDefaultOwner({
            ss: {
                bullsStrength: bullsStrength,
                catsGrace: catsGrace,
                /* bearsEndurance: bearsEndurance, */
            }
        })
        const str = csFromStatus('str')(owner)
        const dex = csFromStatus('dex')(owner)
        const con = csFromStatus('con')(owner)

        assert.equal(str.total(), 4)
        assert.equal(dex.total(), 4)
        assert.equal(con.total(), 0)

        /* console.log(str) */
        assert.exists(findNodeMatching(str, 'str-from-status', {
            includeRoot: true,
        }))
        assert.exists(findNodeMatching(str, /bull/))
        assert.exists(findNodeMatching(dex, /cats/))
        assert.notExists(findNodeMatching(con, /bears/))
    })
})