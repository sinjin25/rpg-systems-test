import { findNodeMatching, leaf } from ".."
import { createDefaultOwner, OwnerMaximal } from "../../actor2"
import { shortsword } from "../../equipment-sheet2/defaults"
import { BaseEquipment } from "../../equipment-sheet2/types"
import { Feat2 } from "../../feat2"
import addFeat from "../../feat2/add-feat"
import modNodeToText from "../format"
import attack from "./attack"
import { describe, test, assert, expect } from 'vitest'



describe('Assumption errors', () => {
    // the following is what makes it safe to pass a finished tree to a different owner's tree in terminal-composition
    test('A tree is effectively frozen because children are created at first build and never modified', () => {
        const myShortsword: BaseEquipment = {
            ...shortsword,
            tags: ['finesse', 'melee']
        }
        const myFeat: Feat2 = {
            displayName: 'finessething',
            broadContexts: {
                'attack-feat-mod': (o, opts) => {
                    if (opts.tags?.includes('finesse')) return leaf('finessething', 99)
                }
            }
        }
        const owner = createDefaultOwner()
        addFeat(owner, myFeat)

        const nonFinesseAttack = attack(owner)
        const SHOULD_STAY_AS = nonFinesseAttack.total()
        assert.equal(SHOULD_STAY_AS, 3)
        // the value is reproducible
        assert.equal(nonFinesseAttack.total(), nonFinesseAttack.total())

        owner.es.mainhand = myShortsword

        const newAttack = attack(owner)
        assert.equal(newAttack.total(), 99 + 3)
        const f1 = findNodeMatching(newAttack, /finessething/)
        assert.exists(f1)

        // IF you were to run attack again, it would build the tree fresh. finessething would apply this time
        assert.equal(SHOULD_STAY_AS, nonFinesseAttack.total())
        /* console.log(modNodeToText(nonFinesseAttack))
        console.log(owner.tags) */
        const f2 = findNodeMatching(nonFinesseAttack, /finessething/)
        assert.notExists(f2)

        // if you found a way to modify the children, .total() would produce a new value but you're just trolling at that point
    })
})