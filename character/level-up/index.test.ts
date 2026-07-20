import { describe, test, assert } from 'vitest'
import { commitLevelUp, previewLevelUp, LevelUpError } from './index'
import { Owner } from '../actor'
import { ClassLevels, ClassLevelMember, ClassLevelSheet } from '../../character-sheet/class-level/type'
import { getCharacterLevel } from '../../character-sheet/class-level'
import { fighterClassLevels } from '../../character-sheet/class-level/fighter'
import { createDefaultAbilitySheet } from '../../ability-sheet'
import { FeatSheet } from '../../feat'
import { featPrereqDemoC, featPrereqDemoD } from '../../feat/feats'

// minimal owner; preview/commit only read cs + fs. str 10 keeps prereqs that key
// off strength (e.g. featPrereqDemoRequiresCOrDorStr) from passing incidentally.
const makeOwner = (levels: ClassLevelSheet, fs: FeatSheet = {}): Owner => ({
    cs: { con: 10, dex: 10, str: 10, levels },
    fs: { ...fs },
    es: {},
    ss: {},
    as: createDefaultAbilitySheet(),
})

const fighterAt = (level: number): ClassLevels => ({ displayName: 'Fighter', data: fighterClassLevels, level })

// pure portion
describe('previewLevelUp', () => {
    test('A new class dip resolves correctly', () => {
        const owner = makeOwner({})

        const preview = previewLevelUp(owner, 'fighter')

        assert.equal(preview.atMax, false)
        assert.equal(preview.nextLevel, 1)
        assert.exists(preview.grantedFeats.featAlert) // from fighter 1
        assert.equal(preview.offersBonusFeat, true)   // from fighter 1
        // ensure no mutations
        assert.deepEqual(owner.cs.levels, {})
        assert.deepEqual(owner.fs, {})
    })

    test('eligibleFeats excludes already-granted feats and prereq-unmet feats', () => {
        const owner = makeOwner({})

        const { eligibleFeats } = previewLevelUp(owner, 'fighter')

        assert.notInclude(eligibleFeats, 'featAlert') // fighter 1 but 
        assert.include(eligibleFeats, 'featPowerAttack')     // no prereq -> eligible
        assert.notInclude(eligibleFeats, 'featPrereqDemoB')  // needs C and D, unmet
    })

    test('Boundary: a class at its table max reports atMax with no grants', () => {
        const owner = makeOwner({ fighter: fighterAt(fighterClassLevels.length) })

        const preview = previewLevelUp(owner, 'fighter')

        assert.equal(preview.atMax, true)
        assert.equal(preview.offersBonusFeat, false)
        assert.deepEqual(preview.grantedFeats, {})
        assert.deepEqual(preview.eligibleFeats, [])
    })

    test('an unknown class reports atMax rather than throwing', () => {
        const preview = previewLevelUp(makeOwner({}), 'wizard')
        assert.equal(preview.atMax, true)
    })
})

describe('commitLevelUp mutates', () => {
    test('Can dip: registers the class at level 1 and grants its feats', () => {
        const owner = makeOwner({})

        const result = commitLevelUp(owner, { className: 'fighter', bonusFeat: 'featPowerAttack' })

        assert.equal(result.ok, true)
        if (!result.ok) throw Error('commitLevelUp failed')
        assert.equal(result.newLevel, 1)
        assert.includeMembers(result.addedFeats, ['featAlert', 'featPowerAttack'])
        assert.equal(owner.cs.levels.fighter.level, 1)
        assert.exists(owner.fs.featAlert)       // free grant
        assert.exists(owner.fs.featPowerAttack)  // selected bonus
        assert.equal(getCharacterLevel(owner.cs), 1)
    })

    test('advances an existing class and merges the next grant', () => {
        const owner = makeOwner({ fighter: fighterAt(1) })

        const result = commitLevelUp(owner, { className: 'fighter' }) // L2 grants featConSaves, no bonus

        assert.equal(result.ok, true)
        assert.equal(owner.cs.levels.fighter.level, 2)
        assert.exists(owner.fs.featConSaves)
    })

    test('a prereq-unmet bonus pick is rejected and mutates nothing (transactional)', () => {
        // a bespoke class that offers a bonus but grants nothing to satisfy it
        const barren: ClassLevelMember = { attackBonus: 0, fortitudeSave: 0, reflexSave: 0, feats: {}, selectBonusFeat: true }
        const owner = makeOwner({ test: { displayName: 'test', data: [barren], level: 0 } })

        const result = commitLevelUp(owner, { className: 'test', bonusFeat: 'featPrereqDemoB' }) // needs C and D

        assert.deepEqual(result, { ok: false, reason: LevelUpError.prereqUnmet })
        assert.deepEqual(owner.fs, {})
        assert.equal(owner.cs.levels.test.level, 0)
    })
})

describe('commitLevelUp validates', () => {
    test('ordering: a feat granted this level satisfies the bonus pick in the same call (issue #37)', () => {
        // the level grants C and D (prereqs of B) AND offers a bonus feat -> picking
        // B succeeds because grants are applied to the temp sheet before the pick
        const unlocking: ClassLevelMember = {
            attackBonus: 0, fortitudeSave: 0, reflexSave: 0,
            feats: { featPrereqDemoC, featPrereqDemoD },
            selectBonusFeat: true,
        }
        const owner = makeOwner({ combo: { displayName: 'Combo', data: [unlocking], level: 0 } })

        const result = commitLevelUp(owner, { className: 'combo', bonusFeat: 'featPrereqDemoB' })

        assert.equal(result.ok, true)
        assert.exists(owner.fs.featPrereqDemoB)
        assert.exists(owner.fs.featPrereqDemoC)
        assert.exists(owner.fs.featPrereqDemoD)
    })

    test('rejects a missing bonus feat when the level offers one', () => {
        const owner = makeOwner({})
        const result = commitLevelUp(owner, { className: 'fighter' }) // L1 offers a bonus
        assert.deepEqual(result, { ok: false, reason: LevelUpError.bonusFeatRequired })
        assert.deepEqual(owner.cs.levels, {}) // untouched
    })

    test('rejects a bonus feat when the level does not offer one', () => {
        const owner = makeOwner({ fighter: fighterAt(1) }) // L2 has no selectBonusFeat
        const result = commitLevelUp(owner, { className: 'fighter', bonusFeat: 'featPowerAttack' })
        assert.deepEqual(result, { ok: false, reason: LevelUpError.unexpectedBonusFeat })
    })

    test('rejects an unknown class', () => {
        const result = commitLevelUp(makeOwner({}), { className: 'wizard' })
        assert.deepEqual(result, { ok: false, reason: LevelUpError.unknownClass })
    })

    test('rejects a class already at its table max', () => {
        const owner = makeOwner({ fighter: fighterAt(fighterClassLevels.length) })
        const result = commitLevelUp(owner, { className: 'fighter' })
        assert.deepEqual(result, { ok: false, reason: LevelUpError.atMax })
    })
})