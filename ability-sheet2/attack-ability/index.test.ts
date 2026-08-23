import { describe, test, assert } from 'vitest'
import { Actor2, createDefaultOwner, instantiateActor } from '../../actor2'
import newModNode, { leaf, ModNode, sumFunc } from '../../log2'
import rollTree from '../../log2/roll'
import { setSeed, clearSeed } from '../../roll'
import { BaseEquipment } from '../../equipment-sheet2/types'
import { iterate } from '../../simulate/util/iterate'
import { Participants } from '../abilities2'
import { applyAttackResolutions } from '../../actor2/act'
import { applyDamage } from '../../health'
import { resolvePayload, resolveStep, RESOLVE_PAYLOAD_DEFAULT_OPTS } from './index'
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

    test('a state-aware mod reads the target and changes the roll (full-life bonus)', () => {
        // +100 to hit, but only while the target is at full life (reads target at resolve time)
        const vital: AttackDiscreteTargetGroupPayload = {
            onMiss: () => ({}),
            onHit: () => ({}),
            augments: {
                attackResult: {
                    mod: (_s, t) => leaf('vital', t.health.curr === t.health.max ? 100 : 0),
                },
            },
        }
        const plain: AttackDiscreteTargetGroupPayload = { onMiss: () => ({}), onHit: () => ({}) }

        // a seed where a plain attack ordinarily misses a full-life target (not a nat-1)
        const miss = findRun(
            (seed) => ({ seed, res: resolvePayload(armedActor(), targetActor(), plain) }),
            x => x.res.result.hook === 'onMiss' && rollOf(x.res.result.sar.attackResult!) > 1,
        )

        // same seed, full-life target -> the +100 applies -> now a hit
        setSeed(miss.seed)
        const full = resolvePayload(armedActor(), targetActor(), vital)
        clearSeed()
        assert.notEqual(full.result.hook, 'onMiss')

        // same seed, a damaged target -> predicate false, +0 -> still a miss
        setSeed(miss.seed)
        const source = armedActor()
        const damagedTarget = targetActor()
        applyDamage(damagedTarget.health, 1) // no longer full life
        const damaged = resolvePayload(source, damagedTarget, vital)
        clearSeed()
        assert.equal(damaged.result.hook, 'onMiss')
    })

    test('a state-aware override receives the source', () => {
        // replace the threat range with a value derived from the source's stats (str = 10)
        const payload: AttackDiscreteTargetGroupPayload = {
            onHit: () => ({}),
            onThreaten: () => ({}),
            onCrit: () => ({}),
            augments: { threatResult: { override: (s) => leaf('src-threat', s.owner.cs.str) } },
        }
        // threatResult survives in the final SAR on any hit
        const hit = findRun(
            () => resolvePayload(armedActor(), targetActor(), payload),
            r => r.result.hook !== 'onMiss',
        )
        assert.equal(hit.result.sar.threatResult?.total(), 10)
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

// --- self channel (effects routed back to the source, conditional on a hit) ------------------

describe('self channel', () => {
    // recoil onto the source, only on a hit (no onMiss -> a miss produces no self payload)
    const recoilPayload: AttackDiscreteTargetGroupPayload = {
        onHit: () => ({ self: { damage: [leaf('recoil', 5)] } }),
    }

    test('a hit routes the self payload to the source and damages it', () => {
        let done = false
        for (let seed = 0; seed < 200 && !done; seed++) {
            setSeed(seed)
            const source = armedActor()
            const target = targetActor()
            const { result } = resolvePayload(source, target, recoilPayload)
            if (result.hook === 'onMiss') continue

            assert.exists(result.self?.damage)
            const before = source.health.curr
            applyAttackResolutions([result])
            assert.equal(before - source.health.curr, 5) // recoil landed on the source, not the target
            done = true
        }
        clearSeed()
        assert.isTrue(done, 'expected a hitting seed in [0,200)')
    })

    test('a miss produces no self payload and leaves the source untouched', () => {
        let done = false
        for (let seed = 0; seed < 200 && !done; seed++) {
            setSeed(seed)
            const source = armedActor()
            const target = targetActor()
            const { result } = resolvePayload(source, target, recoilPayload)
            if (result.hook !== 'onMiss') continue

            assert.isUndefined(result.self)
            const before = source.health.curr
            applyAttackResolutions([result])
            assert.equal(source.health.curr, before)
            done = true
        }
        clearSeed()
        assert.isTrue(done, 'expected a missing seed in [0,200)')
    })
})

// --- resolution opts (per-payload overrides of the hit/crit rules) ----------------------------

describe('resolution opts', () => {
    test('RESOLVE_PAYLOAD_DEFAULT_OPTS is the standard-rules set', () => {
        assert.deepEqual(RESOLVE_PAYLOAD_DEFAULT_OPTS, {
            canMiss: true,
            canCrit: true,
            mustCrit: false,
            nat1HitFails: true,
            nat20HitHits: true,
            nat1ThreatFails: true,
            nat20ThreatSucceeds: true,
        })
    })

    test('mustCrit:true forces a confirmed crit on any seed', () => {
        setSeed(0)
        const { result } = resolvePayload(armedActor(), targetActor(), { onCrit: () => ({}) }, { mustCrit: true })
        clearSeed()
        assert.equal(result.hook, 'onCrit')
        assert.exists(result.sar.critDamageResult)
    })

    test('canMiss:false makes a would-be miss land', () => {
        // a seed that misses under the default rules
        const miss = findRun(
            (seed) => ({ seed, res: resolvePayload(armedActor(), targetActor(), {}) }),
            x => x.res.result.hook === 'onMiss',
        )

        setSeed(miss.seed)
        const forced = resolvePayload(armedActor(), targetActor(), {}, { canMiss: false })
        clearSeed()

        assert.equal(miss.res.result.hook, 'onMiss')
        assert.notEqual(forced.result.hook, 'onMiss') // the same roll now lands
    })

    test('canCrit:false forecloses a crit (a confirmed crit becomes a plain hit)', () => {
        // wide threat range + weak target guarantees a crit under default rules
        const critForcing: AttackDiscreteTargetGroupPayload = {
            onHit: () => ({}),
            augments: { threatResult: { override: () => leaf('wide-threat', 2) } },
        }
        const crit = findRun(
            (seed) => ({ seed, res: resolvePayload(armedActor(), weakTarget(), critForcing) }),
            x => x.res.result.hook === 'onCrit',
        )

        setSeed(crit.seed)
        const noCrit = resolvePayload(armedActor(), weakTarget(), critForcing, { canCrit: false })
        clearSeed()

        assert.equal(crit.res.result.hook, 'onCrit')
        assert.equal(noCrit.result.hook, 'onHit') // still lands, just never crits
    })

    test('opts on the payload flow through resolveStep to sarAgainstTarget', () => {
        // a seed where a plain attack ordinarily misses the first enemy
        const miss = findRun(
            (seed) => {
                const source = armedActor()
                const enemy = targetActor()
                return { seed, hook: resolvePayload(source, enemy, {}).result.hook }
            },
            x => x.hook === 'onMiss',
        )

        // same seed, but the payload declares canMiss:false - resolveStep must honour it
        setSeed(miss.seed)
        const source = armedActor()
        const res = resolveStep(
            { ally: [source], enemy: [targetActor()] },
            source,
            {
                tp: { filters: [], simple: 'first', team: 'enemy' },
                payload: [{ opts: { canMiss: false }, onHit: () => ({}) }],
            },
        )
        clearSeed()

        assert.equal(res[0]!.hook, 'onHit')
    })
})
