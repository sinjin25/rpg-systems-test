import { createDefaultOwner, OwnerMaximal } from '../../actor2/index.ts'
import registry, { rage } from '../registry.ts'
import addFeat from '../add-feat/index.ts'
import { newFeatsForOwnerList } from './index.ts'
import { describe, test, assert } from 'vitest'
import { Feat2, FeatIds } from '../types.ts'

describe('newFeatsForOwnerList', () => {
    test('meetsPrereq reflects whether the owner satisfies prerequisites()', () => {
        const owner = createDefaultOwner()
        const failOwner = createDefaultOwner({
            cs: { str: 9 }
        })

        const fakeReg: Partial<Record<FeatIds, Feat2>> = {
            'Armor Training': {
                displayName: 'Armor Training',
                broadContexts: {},
                description: '',
                prerequisites: (owner: OwnerMaximal) => {
                    return owner.cs.str >= 11
                }
            }
        }

        // @ts-expect-error
        const pass = newFeatsForOwnerList(owner, fakeReg)
        assert.equal(pass.length, 1)
        const find = pass.find(a => a.id === 'Armor Training' && a.meetsPrereq)
        assert.exists(find)

        addFeat(owner, rage)

        // @ts-expect-error
        const fail = newFeatsForOwnerList(failOwner, fakeReg)
        assert.equal(fail.length, 1)
        const find2 = fail.find(a => a.id === 'Armor Training' && a.meetsPrereq)
        assert.notExists(find2)
    })

    test('defaults to the real registry when none is passed', () => {
        const owner = createDefaultOwner()
        const wrappers = newFeatsForOwnerList(owner)
        assert.equal(wrappers.length, Object.keys(registry).length)
    })
})
