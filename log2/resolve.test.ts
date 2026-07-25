import { describe, test, assert } from 'vitest'
import { leaf, ModNode, Roller } from './index.ts'
import { modNodeToText } from './format.ts'
import { measuredStrike, renderAttempts, Attempt } from './resolve.ts'

// hands back the given rolls in order, so a tree with dice in it is still assertable
const scriptedRoller = (...results: number[]): Roller => {
    let i = 0
    return () => results[i++]
}

const find = (name: string, from: ModNode): ModNode | undefined => {
    if (from.displayName === name) return from
    for (const c of from.children) {
        const hit = find(name, c)
        if (hit) return hit
    }
    return undefined
}

// every attempt in a resolution is a stub Modifier + a rolled d20. The real modifier tree
// (str/weapon/feats) is out of scope here - the resolution layer only cares that it folds to a
// number, so a leaf stands in for it.
const modifier = leaf('Modifier', 8)

describe('measuredStrike resolution', () => {
    test('a first-roll hit is a single attempt with no average node', () => {
        // natural 10 + mod 8 = 18 >= 15
        const attempts = measuredStrike(scriptedRoller(10), modifier, 15)

        assert.equal(attempts.length, 1)
        assert.equal(attempts[0].hit, true)
        assert.equal(attempts[0].attack.total(), 18)
        // the trigger never fired, so the tree never grew an average node
        assert.equal(find('Measured Strike Average', attempts[0].attack), undefined)
    })

    test('a miss triggers a reroll averaged with the original, which can then hit', () => {
        // first: 3 + 8 = 11 < 15 (miss); retry averages floor((3+20)/2)=11, 11 + 8 = 19 >= 15 (hit)
        const attempts = measuredStrike(scriptedRoller(3, 20), modifier, 15)

        assert.equal(attempts.length, 2)
        assert.equal(attempts[0].hit, false)
        assert.equal(attempts[1].hit, true)
        assert.equal(find('Measured Strike Average', attempts[1].attack)!.total(), 11, 'floor(avg(3, 20))')
        assert.equal(attempts[1].attack.total(), 19)
    })

    test('the retry is a single retry - if the averaged roll also misses, it stops', () => {
        // first: 2 + 8 = 10 (miss); retry: floor((2+4)/2)=3, 3 + 8 = 11 (still miss). no third pass.
        const attempts = measuredStrike(scriptedRoller(2, 4), modifier, 15)

        assert.equal(attempts.length, 2)
        assert.equal(attempts[0].hit, false)
        assert.equal(attempts[1].hit, false)
    })

    test('an oversized-dice effect reapplies to the retried roll (tree rebuilt, not mutated)', () => {
        const seen: number[] = []
        const spy: Roller = (sides) => { seen.push(sides); return 1 } // always low -> both miss vs AC 100
        const oversized = [leaf('Base', 20), leaf('Oversized Dice', 4)]

        const attempts = measuredStrike(spy, modifier, 100, oversized)

        assert.equal(attempts.length, 2)
        // both the natural roll and the retry's second roll were rolled against the grown die
        assert.deepEqual(seen, [24, 24], 'Sides folded to 24 before each roll')
    })

    test('renders the two logs: the value tree per attempt, and the event log across attempts', () => {
        const hit = measuredStrike(scriptedRoller(10), modifier, 15)
        const retried = measuredStrike(scriptedRoller(3, 20), modifier, 15)

        console.log('\n--- first-roll hit (value tree) ---\n' + modNodeToText(hit[0].attack))
        console.log('\n--- missed then retried (value tree, attempt 2) ---\n' + modNodeToText(retried[1].attack))
        console.log('\n--- event log ---\n' + renderAttempts(retried))
    })

    test('renders an oversized-dice roll - the Sides subtree explains the grown die', () => {
        // an effect turns the d20 into a d24. rolls above 20 are only reachable because Sides grew,
        // and the effect reappears on the retried roll because the tree is rebuilt each pass.
        const oversized = [leaf('Base', 20), leaf('Oversized Dice', 4)]
        const attempts = measuredStrike(scriptedRoller(3, 22), modifier, 15, oversized)

        console.log('\n--- oversized dice: missed then retried (value tree, attempt 2) ---\n'
            + modNodeToText(attempts[1].attack))
    })
})
