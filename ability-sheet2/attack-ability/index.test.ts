import { describe, test, assert } from 'vitest'
import { createDefaultOwner, instantiateActor } from '../../actor2'
import { Actor2 } from '../../actor2/types'
import newModNode, { findNodeMatching, leaf, ModNode, sumFunc } from '../../log2'
import rollTree from '../../log2/roll'
import { createRoll } from '../../roll'
import { RollInstance } from '../../roll/types'
import { BaseEquipment } from '../../equipment-sheet2/types'
import { iterate } from '../../simulate/util/iterate'
import { Participants } from '../abilities2'
import { applyAttackResolutions } from '../../actor2/act'
import { applyDamage } from '../../health'
import { resolvePayload, resolveStep, RESOLVE_PAYLOAD_DEFAULT_OPTS } from './index'
import { AttackDiscreteTargetGroup, AttackDiscreteTargetGroupPayload } from './types'
import { armors, SLOT_TYPE } from '../../equipment-sheet2/defaults'

// --- fixtures -------------------------------------------------------------

// fixed-die weapon so only the d20s vary between seeds (mirrors attack.test.ts)
const testWeapon = (displayName: string): BaseEquipment => ({
    displayName,
    acceptableSlots: SLOT_TYPE.weapon,
    tags: ['melee'],
    broadContexts: {
        damage: (o, opts) => newModNode(displayName, [rollTree({ diceSides: 6 })(o, opts)], sumFunc),
        'crit-multiplier': () => leaf(displayName, 2),
    },
})

const armedActor = (rollInstance: RollInstance): Actor2 =>
    instantiateActor(createDefaultOwner({
        cs: { str: 10, dex: 10 },
        es: { mainhand: testWeapon('mainhand-weapon') },
    }), false, { rollInstance })

// AC 10 (base + 0 dex, weapon contributes no AC), so an ordinary d20 decides hit/threat
const targetActor = (rollInstance: RollInstance): Actor2 =>
    instantiateActor(createDefaultOwner({
        cs: { str: 10, dex: 10 },
        es: {
            mainhand: testWeapon('target-weapon'),
            armor: armors.breastplate
        },
    }), false, { rollInstance })

// dumped dex tanks the AC so any threat confirms - isolates the confirmed-crit branch
// (mirrors attack.test.ts using a TRIVIAL_AC to reach crits)
const weakTarget = (rollInstance: RollInstance): Actor2 =>
    instantiateActor(createDefaultOwner({
        cs: { str: 10, dex: -999 },
        es: { mainhand: testWeapon('target-weapon') },
    }), false, { rollInstance })

const rollOf = (node: ModNode) => {
    const child = findNodeMatching(node, /roll-total/)
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

// --- seed finder (rearm when seeds break) ---------------------------------

test.skip('SEED FINDER — rearm to locate seeds, then re-disable', () => {
    // outcome routing seeds (stampedPayload vs targetActor)
    const routing = iterate(2000, (seed, ri) => ({
        seed,
        res: resolvePayload(armedActor(ri), targetActor(ri), stampedPayload, undefined, { rollInstance: ri }),
    }))
    console.log('miss seed:', routing.find(x => x.res.result.hook === 'onMiss')?.seed)
    console.log('hit seed:', routing.find(x => x.res.result.hook === 'onHit')?.seed)
    console.log('threaten seed:', routing.find(x => x.res.result.hook === 'onThreaten')?.seed)

    // crit seeds (critForcing/hitOnly + weakTarget)
    const critForcing: AttackDiscreteTargetGroupPayload = {
        ...stampedPayload,
        augments: { threatResult: { override: () => leaf('wide-threat', 2) } },
    }
    const crits = iterate(2000, (seed, ri) => ({
        seed,
        res: resolvePayload(armedActor(ri), weakTarget(ri), critForcing, undefined, { rollInstance: ri }),
    }))
    console.log('crit seed (critForcing+weakTarget):', crits.find(x => x.res.result.hook === 'onCrit')?.seed)

    const hitOnly: AttackDiscreteTargetGroupPayload = {
        onHit: () => ({ damage: [leaf('only-hit', 3)] }),
        augments: { threatResult: { override: () => leaf('wide-threat', 2) } },
    }
    const critsHitOnly = iterate(2000, (seed, ri) => ({
        seed,
        res: resolvePayload(armedActor(ri), weakTarget(ri), hitOnly, undefined, { rollInstance: ri }),
    }))
    console.log('crit seed (hitOnly fallthrough):', critsHitOnly.find(x => x.res.result.hook === 'onCrit')?.seed)

    // misc seeds (targetActor)
    const base: AttackDiscreteTargetGroupPayload = { onMiss: () => ({}), onHit: () => ({}) }
    const misc = iterate(2000, (seed, ri) => ({
        seed,
        res: resolvePayload(armedActor(ri), targetActor(ri), base, undefined, { rollInstance: ri }),
    }))
    console.log('hit seed (no hooks):', misc.find(x => x.res.result.hook === 'onHit')?.seed)
    console.log('hit seed (roll < 20):', misc.find(x =>
        x.res.result.hook !== 'onMiss' && rollOf(x.res.result.sar.attackResult!) < 20,
    )?.seed)
    console.log('miss seed (roll > 1):', misc.find(x =>
        x.res.result.hook === 'onMiss' && rollOf(x.res.result.sar.attackResult!) > 1,
    )?.seed)
    console.log('miss seed (canMiss/opts):', misc.find(x => x.res.result.hook === 'onMiss')?.seed)

    // state-aware override seed
    const withSrcOverride: AttackDiscreteTargetGroupPayload = {
        onHit: () => ({}), onThreaten: () => ({}), onCrit: () => ({}),
        augments: { threatResult: { override: (s) => leaf('src-threat', s.owner.cs.str) } },
    }
    const overrideMisc = iterate(2000, (seed, ri) => ({
        seed,
        res: resolvePayload(armedActor(ri), targetActor(ri), withSrcOverride, undefined, { rollInstance: ri }),
    }))
    console.log('hit seed (state-aware override):', overrideMisc.find(x => x.res.result.hook !== 'onMiss')?.seed)

    // canCrit:false crit seed
    const critForcingNoCrit: AttackDiscreteTargetGroupPayload = {
        onHit: () => ({}),
        augments: { threatResult: { override: () => leaf('wide-threat', 2) } },
    }
    const noCritSeeds = iterate(2000, (seed, ri) => ({
        seed,
        res: resolvePayload(armedActor(ri), weakTarget(ri), critForcingNoCrit, undefined, { rollInstance: ri }),
    }))
    console.log('crit seed (canCrit:false):', noCritSeeds.find(x => x.res.result.hook === 'onCrit')?.seed)
})

// --- outcome discrimination -----------------------------------------------
// Seeds: miss=0, hit=1, threaten=73, crit(critForcing+weakTarget)=0

describe('resolvePayload outcome routing', () => {
    test('a miss fires onMiss, reports defenderSuccess, and carries no weapon damage', () => {
        const ri = createRoll(0)
        const { defenderSuccess, result } = resolvePayload(armedActor(ri), targetActor(ri), stampedPayload, undefined, { rollInstance: ri })

        assert.equal(result.hook, 'onMiss')
        assert.isTrue(defenderSuccess)
        assert.isUndefined(result.sar.damageResult)
        assert.isUndefined(result.sar.critDamageResult)
        assert.deepEqual(names(result.damage), [])
    })

    test('a hit fires onHit; weapon damage comes from the SAR, hook damage stacks on top', () => {
        const ri = createRoll(1)
        const { defenderSuccess, result } = resolvePayload(armedActor(ri), targetActor(ri), stampedPayload, undefined, { rollInstance: ri })

        assert.equal(result.hook, 'onHit')
        assert.isFalse(defenderSuccess)
        assert.exists(result.sar.damageResult)
        assert.isUndefined(result.sar.critDamageResult)
        assert.deepEqual(names(result.damage), ['bonus-hit'])
    })

    test('a threat that does not confirm fires onThreaten', () => {
        const ri = createRoll(73)
        const { result } = resolvePayload(armedActor(ri), targetActor(ri), stampedPayload, undefined, { rollInstance: ri })

        assert.equal(result.hook, 'onThreaten')
        assert.exists(result.sar.critConfirmResult)
        assert.isUndefined(result.sar.critDamageResult)
        assert.deepEqual(names(result.damage), ['bonus-threaten'])
    })

    test('a confirmed crit fires onCrit and carries crit damage from the SAR', () => {
        const critForcing: AttackDiscreteTargetGroupPayload = {
            ...stampedPayload,
            augments: { threatResult: { override: () => leaf('wide-threat', 2) } },
        }
        const ri = createRoll(0)
        const { result } = resolvePayload(armedActor(ri), weakTarget(ri), critForcing, undefined, { rollInstance: ri })

        assert.equal(result.hook, 'onCrit')
        assert.exists(result.sar.critDamageResult)
        assert.deepEqual(names(result.damage), ['bonus-crit'])
    })
})

// --- hook fallthrough -----------------------------------------------------
// Seeds: crit(hitOnly+weakTarget)=0, hit(no hooks)=1

describe('hook fallthrough', () => {
    test('onCrit falls back to onHit when onCrit is undefined', () => {
        const hitOnly: AttackDiscreteTargetGroupPayload = {
            onHit: () => ({ damage: [leaf('only-hit', 3)] }),
            augments: { threatResult: { override: () => leaf('wide-threat', 2) } },
        }
        const ri = createRoll(0)
        const { result } = resolvePayload(armedActor(ri), weakTarget(ri), hitOnly, undefined, { rollInstance: ri })

        assert.equal(result.hook, 'onCrit')
        assert.deepEqual(names(result.damage), ['only-hit'])
    })

    test('a missing hook is a no-op rather than a crash', () => {
        const ri = createRoll(1)
        const { result } = resolvePayload(armedActor(ri), targetActor(ri), {}, undefined, { rollInstance: ri })

        assert.equal(result.hook, 'onHit')
        assert.deepEqual(names(result.damage), [])
    })
})

// --- augments reach the hit determination ---------------------------------
// Seeds: hit(roll<20)=1, miss(roll>1)=0, hit(state-aware override)=1

describe('augments', () => {
    test('a to-hit penalty augment turns an ordinary hit into a miss at the same seed', () => {
        const base: AttackDiscreteTargetGroupPayload = { onMiss: () => ({}), onHit: () => ({}) }

        const ri1 = createRoll(1)
        const hit = resolvePayload(armedActor(ri1), targetActor(ri1), base, undefined, { rollInstance: ri1 })

        const ri2 = createRoll(1)
        const penalized = resolvePayload(armedActor(ri2), targetActor(ri2), {
            ...base,
            augments: { attackResult: { mod: leaf('big-penalty', -100) } },
        }, undefined, { rollInstance: ri2 })

        assert.notEqual(hit.result.hook, 'onMiss')
        assert.isTrue(rollOf(hit.result.sar.attackResult!) < 20)
        assert.equal(penalized.result.hook, 'onMiss')
    })

    test('a state-aware mod reads the target and changes the roll (full-life bonus)', () => {
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

        // seed 0: plain attack misses a full-life target (roll > 1)
        const ri1 = createRoll(0)
        const plainMiss = resolvePayload(armedActor(ri1), targetActor(ri1), plain, undefined, { rollInstance: ri1 })
        assert.equal(plainMiss.result.hook, 'onMiss')
        assert.isTrue(rollOf(plainMiss.result.sar.attackResult!) > 1)

        // same seed, full-life target -> +100 applies -> now a hit
        const ri2 = createRoll(0)
        const full = resolvePayload(armedActor(ri2), targetActor(ri2), vital, undefined, { rollInstance: ri2 })
        assert.notEqual(full.result.hook, 'onMiss')

        // same seed, a damaged target -> predicate false, +0 -> still a miss
        const ri3 = createRoll(0)
        const source = armedActor(ri3)
        const damagedTarget = targetActor(ri3)
        applyDamage(damagedTarget.health, 1) // no longer full life
        const damaged = resolvePayload(source, damagedTarget, vital, undefined, { rollInstance: ri3 })
        assert.equal(damaged.result.hook, 'onMiss')
    })

    test('a state-aware override receives the source', () => {
        const payload: AttackDiscreteTargetGroupPayload = {
            onHit: () => ({}),
            onThreaten: () => ({}),
            onCrit: () => ({}),
            augments: { threatResult: { override: (s) => leaf('src-threat', s.owner.cs.str) } },
        }
        const ri = createRoll(1)
        const hit = resolvePayload(armedActor(ri), targetActor(ri), payload, undefined, { rollInstance: ri })

        assert.notEqual(hit.result.hook, 'onMiss')
        assert.equal(hit.result.sar.threatResult?.total(), 10)
    })
})

// --- chainOnly ------------------------------------------------------------

describe('chainOnly', () => {
    // firstMod skews the first payload's to-hit so its outcome is forced (nat-1/nat-20 aside)
    const runChain = (firstMod: number, seed: number) => {
        let secondTriggered = false
        const ri = createRoll(seed)
        const source = armedActor(ri)
        const p: Participants = { ally: [source], enemy: [targetActor(ri)] }
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
        const res = resolveStep(p, source, step, { rollInstance: ri })
        return { firstHook: res[0].hook, secondTriggered, count: res.length }
    }

    test('stops the chain when the first attack misses', () => {
        const run = runChain(-100, 0)

        assert.equal(run.firstHook, 'onMiss')
        assert.isFalse(run.secondTriggered)
        assert.equal(run.count, 1)
    })

    test('continues the chain when the first attack lands', () => {
        const run = runChain(+100, 0)

        assert.notEqual(run.firstHook, 'onMiss')
        assert.isTrue(run.secondTriggered)
        assert.equal(run.count, 2)
    })
})

// --- self channel (effects routed back to the source, conditional on a hit) ------------------
// Seeds: hit=1, miss=0

describe('self channel', () => {
    const recoilPayload: AttackDiscreteTargetGroupPayload = {
        onHit: () => ({ self: { damage: [leaf('recoil', 5)] } }),
    }

    test('a hit routes the self payload to the source and damages it', () => {
        const ri = createRoll(1)
        const source = armedActor(ri)
        const target = targetActor(ri)
        const { result } = resolvePayload(source, target, recoilPayload, undefined, { rollInstance: ri })

        assert.equal(result.hook, 'onHit')
        assert.exists(result.self?.damage)
        const before = source.health.curr
        applyAttackResolutions([result])
        assert.equal(before - source.health.curr, 5)
    })

    test('a miss produces no self payload and leaves the source untouched', () => {
        const ri = createRoll(0)
        const source = armedActor(ri)
        const target = targetActor(ri)
        const { result } = resolvePayload(source, target, recoilPayload, undefined, { rollInstance: ri })

        assert.equal(result.hook, 'onMiss')
        assert.isUndefined(result.self)
        const before = source.health.curr
        applyAttackResolutions([result])
        assert.equal(source.health.curr, before)
    })
})

// --- resolution opts (per-payload overrides of the hit/crit rules) ----------------------------
// Seeds: miss(canMiss/opts)=0, crit(canCrit:false)=0

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
        const ri = createRoll(0)
        const { result } = resolvePayload(armedActor(ri), targetActor(ri), { onCrit: () => ({}) }, { mustCrit: true }, { rollInstance: ri })
        assert.equal(result.hook, 'onCrit')
        assert.exists(result.sar.critDamageResult)
    })

    test('canMiss:false makes a would-be miss land', () => {
        const ri1 = createRoll(0)
        const miss = resolvePayload(armedActor(ri1), targetActor(ri1), {}, undefined, { rollInstance: ri1 })

        const ri2 = createRoll(0)
        const forced = resolvePayload(armedActor(ri2), targetActor(ri2), {}, { canMiss: false }, { rollInstance: ri2 })

        assert.equal(miss.result.hook, 'onMiss')
        assert.notEqual(forced.result.hook, 'onMiss')
    })

    test('canCrit:false forecloses a crit (a confirmed crit becomes a plain hit)', () => {
        const critForcing: AttackDiscreteTargetGroupPayload = {
            onHit: () => ({}),
            augments: { threatResult: { override: () => leaf('wide-threat', 2) } },
        }

        const ri1 = createRoll(0)
        const crit = resolvePayload(armedActor(ri1), weakTarget(ri1), critForcing, undefined, { rollInstance: ri1 })

        const ri2 = createRoll(0)
        const noCrit = resolvePayload(armedActor(ri2), weakTarget(ri2), critForcing, { canCrit: false }, { rollInstance: ri2 })

        assert.equal(crit.result.hook, 'onCrit')
        assert.equal(noCrit.result.hook, 'onHit')
    })

    test('opts on the payload flow through resolveStep to sarAgainstTarget', () => {
        const ri1 = createRoll(0)
        const missCheck = resolvePayload(armedActor(ri1), targetActor(ri1), {}, undefined, { rollInstance: ri1 })
        assert.equal(missCheck.result.hook, 'onMiss')

        // same seed, but the payload declares canMiss:false - resolveStep must honour it
        const ri2 = createRoll(0)
        const source = armedActor(ri2)
        const res = resolveStep(
            { ally: [source], enemy: [targetActor(ri2)] },
            source,
            {
                tp: { filters: [], simple: 'first', team: 'enemy' },
                payload: [{ opts: { canMiss: false }, onHit: () => ({}) }],
            },
            { rollInstance: ri2 },
        )

        assert.equal(res[0]!.hook, 'onHit')
    })
})
