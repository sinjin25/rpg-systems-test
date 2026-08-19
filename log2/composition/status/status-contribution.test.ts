import { describe, test, assert } from 'vitest'
import { createDefaultOwner } from '../../../actor2'
import { leaf } from '../..'
import { makeWrapper, newStatusInstance } from '../../../status-sheet2'
import statusContribution from './status-contribution'

const twoInstances = (kind: 'stack' | 'highest') => {
    const w = makeWrapper({
        displayName: 'atk',
        broadContexts: { 'attack-status-mod': () => leaf('atk', 3) },
        stack: { kind },
    })
    const source = createDefaultOwner()
    return [newStatusInstance(w, source), newStatusInstance(w, source)]
}

describe('collectStatusContributions stack policy', () => {
    test("'stack' sums every instance under the key", () => {
        const owner = createDefaultOwner({ ss: { atk: twoInstances('stack') } })
        assert.equal(statusContribution('attack-status-mod')(owner).total(), 6)
    })

    test("'highest' collapses the instances to a single contribution", () => {
        const owner = createDefaultOwner({ ss: { atk: twoInstances('highest') } })
        assert.equal(statusContribution('attack-status-mod')(owner).total(), 3)
    })
})
