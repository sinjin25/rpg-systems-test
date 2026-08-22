import { describe, test, assert } from 'vitest'
import { Actor2, createDefaultOwner, instantiateActor } from '../../actor2'
import newModNode, { leaf, ModNode, sumFunc } from '../../log2'
import rollTree from '../../log2/roll'
import { setSeed, clearSeed } from '../../roll'
import { BaseEquipment } from '../../equipment-sheet2/types'
import { iterate } from '../../simulate/util/iterate'
import { Participants } from '../abilities2'
import { resolvePayload, resolveStep } from './index'
import { AttackDiscreteTargetGroup, AttackDiscreteTargetGroupPayload } from './types'

// --- fixtures -------------------------------------------------------------

// fixed-die weapon so only the d20s vary between seeds (mirrors attack.test.ts)
const testWeapon = (displayName: string): BaseEquipment => ({
    displayName,
    tags: ['melee'],
    broadContexts: {
        damage: (o) => newModNode(displayName, [rollTree(6)(o)], sumFunc),
        'crit-multiplier': () => leaf(displayName, 2),
    },
})

const armedActor = (): Actor2 =>
    instantiateActor(createDefaultOwner({
        cs: { str: 10, dex: 10 },
        es: { mainhand: testWeapon('mainhand-weapon') },
    }))

// AC 10 (base + 0 dex, weapon contributes no AC), so an ordinary d20 decides hit/threat
const targetActor = (): Actor2 =>
    instantiateActor(createDefaultOwner({
        cs: { str: 10, dex: 10 },
        es: { mainhand: testWeapon('target-weapon') },
    }))

// dumped dex tanks the AC so any threat confirms - isolates the confirmed-crit branch
// (mirrors attack.test.ts using a TRIVIAL_AC to reach crits)
const weakTarget = (): Actor2 =>
    instantiateActor(createDefaultOwner({
        cs: { str: 10, dex: -999 },
        es: { mainhand: testWeapon('target-weapon') },
    }))

// re-runs build under seeds 0..iterations-1, returns the first result satisfying pred
const findRun = <T>(build: (seed: number) => T, pred: (r: T) => boolean, iterations = 2000): T => {
    const hit = iterate(iterations, build).find(pred)
    if (!hit) throw Error(`No seed in [0, ${iterations}) produced a matching run`)
    return hit
}

const rollOf = (node: ModNode) => {
    const child = node.children.find(c => c.displayName === 'roll-total')
    if (!child) throw Error('no roll-total child')
    return child.total()
}

const names = (nodes?: ModNode[]) => (nodes ?? []).map(n => n.displayName)

// a payload whose four hooks each stamp a distinguishable bonus-damage node
const stampedPayload: AttackDiscreteTargetGroupPayload = {
    onMiss: () => ({}),
    onHit: () => ({ damage: [leaf('bonus-hit', 5)] }),
    onThreaten: () => ({ damage: [leaf('bonus-threaten', 7)] }),
    onCrit: () => ({ damage: [leaf('bonus-crit', 9)] }),
}

const runOnce = (payload: AttackDiscreteTargetGroupPayload, target: () => Actor2 = targetActor) => () =>
    resolvePayload(armedActor(), target(), payload)

// --- outcome discrimination ----------------------------------------------

describe('resolvePayload outcome routing', () => {
    test('a miss fires onMiss, reports defenderSuccess, and carries no weapon damage', () => {
        const { defenderSuccess, result } = findRun(runOnce(stampedPayload), r => r.result.hook === 'onMiss')

        assert.equal(result.hook, 'onMiss')
        assert.isTrue(defenderSuccess)
        assert.isUndefined(result.sar.damageResult)
        assert.isUndefined(result.sar.critDamageResult) // a crit also lacks damageResult - a miss lacks both
        assert.deepEqual(names(result.damage), [])
    })

    test('a hit fires onHit; weapon damage comes from the SAR, hook damage stacks on top', () => {
        const { defenderSuccess, result } = findRun(runOnce(stampedPayload), r => r.result.hook === 'onHit')

        assert.equal(result.hook, 'onHit')
        assert.isFalse(defenderSuccess)
        assert.exists(result.sar.damageResult)        // weapon damage, automatic
        assert.isUndefined(result.sar.critDamageResult)
        assert.deepEqual(names(result.damage), ['bonus-hit']) // additive bonus, from the hook
    })

    test('a threat that does not confirm fires onThreaten', () => {
        const { result } = findRun(runOnce(stampedPayload), r => r.result.hook === 'onThreaten')

        assert.equal(result.hook, 'onThreaten')
        assert.exists(result.sar.critConfirmResult)
        assert.isUndefined(result.sar.critDamageResult)
        assert.deepEqual(names(result.damage), ['bonus-threaten'])
    })

    test('a confirmed crit fires onCrit and carries crit damage from the SAR', () => {
        // widen the threat range (a threatResult override, per issue 124) so a threat isn't
        // pinned to nat-20; against weakTarget's AC the confirm then lands.
        const critForcing: AttackDiscreteTargetGroupPayload = {
            ...stampedPayload,
            augments: { threatResult: { override: () => leaf('wide-threat', 2) } },
        }
        const { result } = findRun(runOnce(critForcing, weakTarget), r => r.result.hook === 'onCrit')

        assert.equal(result.hook, 'onCrit')
        assert.exists(result.sar.critDamageResult)    // scaled weapon damage, automatic
        assert.deepEqual(names(result.damage), ['bonus-crit'])
    })
})

// --- hook fallthrough -----------------------------------------------------

describe('hook fallthrough', () => {
    test('onCrit falls back to onHit when onCrit is undefined', () => {
        const hitOnly: AttackDiscreteTargetGroupPayload = {
            onHit: () => ({ damage: [leaf('only-hit', 3)] }),
            augments: { threatResult: { override: () => leaf('wide-threat', 2) } },
        }
        const { result } = findRun(runOnce(hitOnly, weakTarget), r => r.result.hook === 'onCrit')

        assert.equal(result.hook, 'onCrit')
        assert.deepEqual(names(result.damage), ['only-hit'])
    })

    test('a missing hook is a no-op rather than a crash', () => {
        // no hooks at all: every outcome should still resolve
        const { result } = findRun(runOnce({}), r => r.result.hook === 'onHit')
        assert.equal(result.hook, 'onHit')
        assert.deepEqual(names(result.damage), [])
    })
})

// --- augments reach the hit determination ---------------------------------

describe('augments', () => {
    test('a to-hit penalty augment turns an ordinary hit into a miss at the same seed', () => {
        const base: AttackDiscreteTargetGroupPayload = { onMiss: () => ({}), onHit: () => ({}) }

        // a seed that lands an *ordinary* hit (not a nat-20, which would ignore the penalty)
        const hit = findRun(
            (seed) => ({ seed, res: resolvePayload(armedActor(), targetActor(), base) }),
            x => x.res.result.hook !== 'onMiss' && rollOf(x.res.result.sar.attackResult!) < 20,
        )

        setSeed(hit.seed)
        const penalized = resolvePayload(armedActor(), targetActor(), {
            ...base,
            augments: { attackResult: { mod: leaf('big-penalty', -100) } },
        })
        clearSeed()

        assert.notEqual(hit.res.result.hook, 'onMiss')
        assert.equal(penalized.result.hook, 'onMiss')
    })
})

// --- chainOnly ------------------------------------------------------------

describe('chainOnly', () => {
    // firstMod skews the first payload's to-hit so its outcome is forced (nat-1/nat-20 aside)
    const runChain = (firstMod: number) => () => {
        let secondTriggered = false
        const source = armedActor()
        const p: Participants = { ally: [source], enemy: [targetActor()] }
        const step: AttackDiscreteTargetGroup = {
            tp: { filters: [], simple: 'first', team: 'enemy' },
            payload: [
                {
                    chainOnly: true,
                    augments: { attackResult: { mod: leaf('chain-skew', firstMod) } },
                    onMiss: () => ({}),
                    onHit: () => ({}),
                },
                {
                    onMiss: () => { secondTriggered = true; return {} },
                    onHit: () => { secondTriggered = true; return {} },
                },
            ],
        }
        const res = resolveStep(p, source, step)
        return { firstHook: res[0].hook, secondTriggered, count: res.length }
    }

    test('stops the chain when the first attack misses', () => {
        const run = findRun(runChain(-100), r => r.firstHook === 'onMiss')

        assert.equal(run.firstHook, 'onMiss')
        assert.isFalse(run.secondTriggered)
        assert.equal(run.count, 1)
    })

    test('continues the chain when the first attack lands', () => {
        const run = findRun(runChain(+100), r => r.firstHook !== 'onMiss')

        assert.notEqual(run.firstHook, 'onMiss')
        assert.isTrue(run.secondTriggered)
        assert.equal(run.count, 2)
    })
})
