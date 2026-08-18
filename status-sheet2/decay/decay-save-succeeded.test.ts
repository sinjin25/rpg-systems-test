import { makeWrapper, StatusEffectInstance, StatusEffectWrapper } from '..'
import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import { decaySaveSucceeded } from './decay-save-succeeded'
import { describe, test, assert, afterEach } from 'vitest'
import { setSeed, clearSeed } from '../../roll'
import save from '../../log2/terminal/save'
import newModNode, { leaf, ModNode, sumFunc } from '../../log2'

describe('decaySaveSucceeded', () => {
    // seeds chosen so the first roll(20) of the sequence is a known natural;
    // see roll/index.ts (mulberry32)
    const NAT_1 = 7
    const NAT_10 = 58
    const NAT_20 = 36
    // first roll is a natural 1, second is a natural 20
    const NAT_1_THEN_NAT_20 = 79

    afterEach(() => clearSeed())

    const saveBuff = (dc: ModNode, onExpiration?: () => StatusEffectWrapper): StatusEffectInstance => ({
        pointer: { displayName: 'saveBuff', broadContexts: {}, stack: { kind: 'highest' }, onExpiration },
        source: {} as OwnerMaximal,
        expiration: { kind: 'save-succeeded', saveType: 'reflex', dc },
    })

    // the dc is picked relative to the owner's actual reflex mod so these tests
    // don't break when the default character sheet changes
    const reflexMod = (owner: ReturnType<typeof createDefaultOwner>) =>
        save('reflex')(owner)

    test('removes the status when total meets or beats the dc', () => {
        const owner = createDefaultOwner()
        const mod = reflexMod(owner).total()
        owner.ss.test = [saveBuff(
            newModNode('saveBuffDc', [leaf('who cares', 10), reflexMod(owner)], sumFunc)
        )]

        setSeed(NAT_10)
        const result = decaySaveSucceeded(owner)
        assert.notExists(owner.ss.test)

        // decaySaveSucceeded returns a log
        assert.isTrue(Array.isArray(result))
        assert.equal(result.length, 1)
        const item0 = result[0]
        assert.exists(item0)
        // we manually named this key
        assert.equal(item0.key, 'test')
        // both the dc and the save carry the reflex mod, so they tie exactly
        assert.equal(item0.dc.total(), 10 + mod)
        assert.equal(item0.save.total(), 10 + mod)
    })

    test('keeps the status when total is under the dc', () => {
        const owner = createDefaultOwner()
        owner.ss.test = [saveBuff(newModNode('saveBuffDc', [leaf('who cares', 11), reflexMod(owner)], sumFunc))]

        setSeed(NAT_10)
        decaySaveSucceeded(owner)
        assert.exists(owner.ss.test)
    })

    test('removes on a natural 20 even when total is under the dc', () => {
        const owner = createDefaultOwner()
        owner.ss.test = [saveBuff(newModNode('saveBuffDc', [leaf('who cares', 100), reflexMod(owner)], sumFunc))]

        setSeed(NAT_20)
        const result = decaySaveSucceeded(owner)
        assert.notExists(owner.ss.test)
    })

    test('keeps the status on a natural 1 even when total beats the dc', () => {
        const owner = createDefaultOwner()
        owner.ss.test = [saveBuff(leaf('who cares', 1))]

        setSeed(NAT_1)
        decaySaveSucceeded(owner)
        assert.exists(owner.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const owner = createDefaultOwner({
            ss: {
                test: [{
                    pointer: { displayName: 'roundsBuff', broadContexts: {}, stack: { kind: 'highest' } },
                    source: {} as OwnerMaximal,
                    expiration: { kind: 'rounds-elapsed', remaining: 3 },
                }]
            }
        })

        setSeed(NAT_20)
        decaySaveSucceeded(owner)
        assert.exists(owner.ss.test)
    })

    test('runs onExpiration when the save succeeds', () => {
        const followUp = makeWrapper({ displayName: 'follow up', broadContexts: {} })
        const owner = createDefaultOwner()
        owner.ss.test = [saveBuff(leaf('who cares', 1), () => followUp)]

        setSeed(NAT_20)
        decaySaveSucceeded(owner)
        assert.notExists(owner.ss.test)
        assert.equal(owner.ss['follow up']![0]!.pointer.displayName, 'follow up')
    })
})
