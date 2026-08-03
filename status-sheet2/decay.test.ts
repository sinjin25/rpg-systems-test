import { StatusEffect } from '.'
import { createDefaultOwner, instantiateActor } from '../actor2'
import {
    DecayOwner,
    decayActionsElapsed,
    decayEnemyKilled,
    decayRoundsElapsed,
    decaySaveSucceeded,
    decaySpeedElapsed,
    expireStatus,
    expireStatusesAfterFight,
} from './decay'
import { describe, test, assert, expect, afterEach } from 'vitest'
import { setSeed, clearSeed } from '../roll'
import save from '../log2/terminal/save'

describe('decaySpeedElapsed', () => {
    const speedBuff = (): StatusEffect => ({
        displayName: 'test speed status',
        broadContexts: {},
        expiration: { kind: 'speed-elapsed', remaining: 10 },
    })
    test('Removes when remaining hits 0', () => {
        const owner = createDefaultOwner({
            ss: {
                test: speedBuff()
            }
        })

        assert.exists(owner.ss.test)

        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'speed-elapsed') throw Error('incorrect epxiration kind')

        decaySpeedElapsed(owner, 6)
        assert.equal(obj.expiration.remaining, 4)
        assert.exists(owner.ss.test)

        decaySpeedElapsed(owner, 4)
        assert.notExists(owner.ss.test)
    })

    test('Removes when it overshoots', () => {
        const owner = createDefaultOwner({
            ss: {
                test: speedBuff()
            }
        })

        assert.exists(owner.ss.test)
        decaySpeedElapsed(owner, 25)
        assert.notExists(owner.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const owner = createDefaultOwner({
            ss: {
                test: speedBuff()
            }
        })
        owner.ss.test!.expiration!.kind = 'actions-elapsed'

        assert.exists(owner.ss.test)
        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'actions-elapsed') throw Error('incorrect epxiration kind')

        decaySpeedElapsed(owner, 10)
        assert.exists(owner.ss.test)
    })
})

describe('decayActionsElapsed', () => {
    const actionsBuff = (): StatusEffect => ({
        displayName: 'actionsBuff',
        broadContexts: {},
        expiration: {
            kind: 'actions-elapsed',
            remaining: 2,
        }
    })
    test('removes status when the action count hits 0', () => {
        const owner = createDefaultOwner({
            ss: {
                test: actionsBuff()
            }
        })
        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'actions-elapsed') throw Error('incorrect epxiration kind')

        decayActionsElapsed(owner, 1)
        assert.exists(owner.ss.test)
        assert.equal(obj.expiration.remaining, 1)

        decayActionsElapsed(owner, 1)
        assert.notExists(owner.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const owner = createDefaultOwner({
            ss: {
                test: actionsBuff()
            }
        })
        owner.ss.test!.expiration!.kind = 'speed-elapsed'

        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'speed-elapsed') throw Error('incorrect epxiration kind')

        decayActionsElapsed(owner, 5)
        assert.exists(owner.ss.test)
        assert.equal(obj.expiration.remaining, 2)
    })
})

describe('expireStatus', () => {
    const plainStatus = (displayName = 'plain'): StatusEffect => ({
        displayName,
        broadContexts: {},
    })

    test('removes the status from the sheet', () => {
        const owner = createDefaultOwner({
            ss: {
                test: plainStatus()
            }
        })

        assert.exists(owner.ss.test)
        expireStatus(owner, 'test')
        assert.notExists(owner.ss.test)
    })

    test('replaces the status when onExpiration returns a follow-up status', () => {
        const followUp = plainStatus('follow up')
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...plainStatus('original'),
                    onExpiration: () => followUp,
                }
            }
        })

        expireStatus(owner, 'test')
        assert.exists(owner.ss.test)
        assert.equal(owner.ss.test, followUp)
        assert.equal(owner.ss.test.displayName, 'follow up')
    })

    test('passes the owner to onExpiration', () => {
        let seen: unknown = undefined
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...plainStatus(),
                    onExpiration: (data) => {
                        seen = data
                        return undefined
                    },
                }
            }
        })

        expireStatus(owner, 'test')
        assert.equal(seen, owner)
    })

    test('onExpiration runs after the status is already removed', () => {
        let existedDuringCallback: boolean | undefined = undefined
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: {
                    ...plainStatus(),
                    onExpiration: () => {
                        existedDuringCallback = 'test' in owner.ss
                        return undefined
                    },
                }
            }
        })

        expireStatus(owner, 'test')
        assert.equal(existedDuringCallback, false)
    })

    test('leaves the key removed when onExpiration returns undefined', () => {
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...plainStatus(),
                    onExpiration: () => undefined,
                }
            }
        })

        expireStatus(owner, 'test')
        assert.notExists(owner.ss.test)
    })

    test('does not touch other statuses on the sheet', () => {
        const other = plainStatus('other')
        const owner = createDefaultOwner({
            ss: {
                test: plainStatus(),
                other,
            }
        })

        expireStatus(owner, 'test')
        assert.notExists(owner.ss.test)
        assert.equal(owner.ss.other, other)
    })
})

describe('decayRoundsElapsed', () => {
    const roundsBuff = (): StatusEffect => ({
        displayName: 'roundsBuff',
        broadContexts: {},
        expiration: {
            kind: 'rounds-elapsed',
            remaining: 3,
        }
    })

    test('decrements remaining and removes at 0', () => {
        const owner = createDefaultOwner({
            ss: {
                test: roundsBuff()
            }
        })
        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'rounds-elapsed') throw Error('incorrect epxiration kind')

        decayRoundsElapsed(owner, 1)
        assert.exists(owner.ss.test)
        assert.equal(obj.expiration.remaining, 2)

        decayRoundsElapsed(owner, 2)
        assert.notExists(owner.ss.test)
    })

    test('removes when it overshoots', () => {
        const owner = createDefaultOwner({
            ss: {
                test: roundsBuff()
            }
        })

        assert.exists(owner.ss.test)
        decayRoundsElapsed(owner, 25)
        assert.notExists(owner.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const owner = createDefaultOwner({
            ss: {
                test: roundsBuff()
            }
        })
        owner.ss.test!.expiration!.kind = 'speed-elapsed'

        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'speed-elapsed') throw Error('incorrect epxiration kind')

        decayRoundsElapsed(owner, 10)
        assert.exists(owner.ss.test)
        assert.equal(obj.expiration.remaining, 3)
    })

    test('runs onExpiration when it decays', () => {
        const followUp: StatusEffect = {
            displayName: 'follow up',
            broadContexts: {},
        }
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...roundsBuff(),
                    onExpiration: () => followUp,
                }
            }
        })

        decayRoundsElapsed(owner, 3)
        assert.equal(owner.ss.test, followUp)
    })

    // tick currently throws until applyHeal/applyDamage are refactored
    test('throws on a heal tick when self is passed', () => {
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...roundsBuff(),
                    expiration: {
                        kind: 'rounds-elapsed',
                        remaining: 3,
                        tick: () => ({ kind: 'heal', amount: 5 }),
                    },
                }
            }
        })
        const actor = instantiateActor(owner)

        expect(() => decayRoundsElapsed(owner, 1, actor))
            .toThrow('applyHeal has not been refactored')
    })

    test('throws on a damage tick when self is passed', () => {
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...roundsBuff(),
                    expiration: {
                        kind: 'rounds-elapsed',
                        remaining: 3,
                        tick: () => { }
                    },
                }
            }
        })
        const actor = instantiateActor(owner)

        expect(() => decayRoundsElapsed(owner, 1, actor))
            .toThrow('applyDamage  has not been refactored')
    })

    test('passes the owner, not self, to tick', () => {
        let seen: unknown = undefined
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...roundsBuff(),
                    expiration: {
                        kind: 'rounds-elapsed',
                        remaining: 3,
                        tick: (data) => {
                            seen = data
                            return { kind: 'heal', amount: 5 }
                        },
                    },
                }
            }
        })
        const self = createDefaultOwner()

        expect(() => decayRoundsElapsed(owner, 1, self)).toThrow()
        assert.equal(seen, owner)
    })

    test('skips the tick entirely when self is omitted', () => {
        let ticked = false
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...roundsBuff(),
                    expiration: {
                        kind: 'rounds-elapsed',
                        remaining: 3,
                        tick: () => {
                            ticked = true
                            return { kind: 'heal', amount: 5 }
                        },
                    },
                }
            }
        })
        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'rounds-elapsed') throw Error('incorrect epxiration kind')

        decayRoundsElapsed(owner, 1)
        assert.equal(ticked, false)
        assert.equal(obj.expiration.remaining, 2)
    })

    // the tick throws before the decrement, so a ticking status never decays today
    test('a ticking status does not decrement when self is passed', () => {
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...roundsBuff(),
                    expiration: {
                        kind: 'rounds-elapsed',
                        remaining: 3,
                        tick: () => ({ kind: 'heal', amount: 5 }),
                    },
                }
            }
        })
        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'rounds-elapsed') throw Error('incorrect epxiration kind')

        expect(() => decayRoundsElapsed(owner, 1, owner)).toThrow()
        assert.equal(obj.expiration.remaining, 3)
    })
})

describe('decaySaveSucceeded', () => {
    // seeds chosen so the first roll(20) of the sequence is a known natural;
    // see roll/index.ts (mulberry32)
    const NAT_1 = 7
    const NAT_10 = 58
    const NAT_20 = 36
    // first roll is a natural 1, second is a natural 20
    const NAT_1_THEN_NAT_20 = 79

    afterEach(() => clearSeed())

    const saveBuff = (dc: number): StatusEffect => ({
        displayName: 'saveBuff',
        broadContexts: {},
        expiration: {
            kind: 'save-succeeded',
            saveType: 'reflex',
            dc,
        }
    })

    // the dc is picked relative to the owner's actual reflex mod so these tests
    // don't break when the default character sheet changes
    const reflexMod = (owner: ReturnType<typeof createDefaultOwner>) =>
        save('reflex')(owner).total()

    test('removes the status when total meets or beats the dc', () => {
        const owner = createDefaultOwner()
        owner.ss.test = saveBuff(10 + reflexMod(owner))

        setSeed(NAT_10)
        decaySaveSucceeded(owner)
        assert.notExists(owner.ss.test)
    })

    test('keeps the status when total is under the dc', () => {
        const owner = createDefaultOwner()
        owner.ss.test = saveBuff(11 + reflexMod(owner))

        setSeed(NAT_10)
        decaySaveSucceeded(owner)
        assert.exists(owner.ss.test)
    })

    test('removes on a natural 20 even when total is under the dc', () => {
        const owner = createDefaultOwner()
        owner.ss.test = saveBuff(100 + reflexMod(owner))

        setSeed(NAT_20)
        decaySaveSucceeded(owner)
        assert.notExists(owner.ss.test)
    })

    test('keeps the status on a natural 1 even when total beats the dc', () => {
        const owner = createDefaultOwner()
        owner.ss.test = saveBuff(1)

        setSeed(NAT_1)
        decaySaveSucceeded(owner)
        assert.exists(owner.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const owner = createDefaultOwner({
            ss: {
                test: {
                    displayName: 'roundsBuff',
                    broadContexts: {},
                    expiration: { kind: 'rounds-elapsed', remaining: 3 },
                }
            }
        })

        setSeed(NAT_20)
        decaySaveSucceeded(owner)
        assert.exists(owner.ss.test)
    })

    test('runs onExpiration when the save succeeds', () => {
        const followUp: StatusEffect = {
            displayName: 'follow up',
            broadContexts: {},
        }
        const owner = createDefaultOwner()
        owner.ss.test = { ...saveBuff(1), onExpiration: () => followUp }

        setSeed(NAT_20)
        decaySaveSucceeded(owner)
        assert.equal(owner.ss.test, followUp)
    })
})

describe('decayEnemyKilled', () => {
    const goblin = () => ({ health: { curr: 0 } })

    const killedBuff = (enemy: { health: { curr: number } }): StatusEffect => ({
        displayName: 'killedBuff',
        broadContexts: {},
        expiration: { kind: 'enemy-killed', enemy },
    })

    test('removes the status whose enemy matches the killed target', () => {
        const enemy = goblin()
        const owner = createDefaultOwner({
            ss: {
                test: killedBuff(enemy)
            }
        })

        decayEnemyKilled([owner], enemy)
        assert.notExists(owner.ss.test)
    })

    test('keeps the status when a different enemy is killed', () => {
        const enemy = goblin()
        const owner = createDefaultOwner({
            ss: {
                test: killedBuff(enemy)
            }
        })

        // structurally identical, but a different object: the check is by reference
        decayEnemyKilled([owner], goblin())
        assert.exists(owner.ss.test)
    })

    test('removes matching statuses across every owner passed in', () => {
        const enemy = goblin()
        const a = createDefaultOwner({ ss: { test: killedBuff(enemy) } })
        const b = createDefaultOwner({ ss: { test: killedBuff(enemy) } })

        decayEnemyKilled([a, b], enemy)
        assert.notExists(a.ss.test)
        assert.notExists(b.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const enemy = goblin()
        const owner = createDefaultOwner({
            ss: {
                test: {
                    displayName: 'roundsBuff',
                    broadContexts: {},
                    expiration: { kind: 'rounds-elapsed', remaining: 3 },
                }
            }
        })

        decayEnemyKilled([owner], enemy)
        assert.exists(owner.ss.test)
    })

    test('runs onExpiration when the enemy dies', () => {
        const enemy = goblin()
        const followUp: StatusEffect = {
            displayName: 'follow up',
            broadContexts: {},
        }
        const owner = createDefaultOwner({
            ss: {
                test: { ...killedBuff(enemy), onExpiration: () => followUp }
            }
        })

        decayEnemyKilled([owner], enemy)
        assert.equal(owner.ss.test, followUp)
    })
})

describe('expireStatusesAfterFight', () => {
    const afterBattleBuff = (displayName = 'afterBattleBuff'): StatusEffect => ({
        displayName,
        broadContexts: {},
        persists: { afterBattle: true },
    })

    test('removes statuses flagged persists.afterBattle', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: afterBattleBuff()
            }
        })

        expireStatusesAfterFight(owner)
        assert.notExists(owner.ss.test)
    })

    test('keeps statuses flagged persists.afterBattle === false', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: {
                    displayName: 'lingering',
                    broadContexts: {},
                    persists: { afterBattle: false },
                }
            }
        })

        expireStatusesAfterFight(owner)
        assert.exists(owner.ss.test)
    })

    test('keeps statuses with no persists field', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: { displayName: 'permanent', broadContexts: {} }
            }
        })

        expireStatusesAfterFight(owner)
        assert.exists(owner.ss.test)
    })

    test('runs onExpiration for the statuses it removes', () => {
        const followUp: StatusEffect = {
            displayName: 'follow up',
            broadContexts: {},
        }
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: { ...afterBattleBuff(), onExpiration: () => followUp }
            }
        })

        expireStatusesAfterFight(owner)
        assert.equal(owner.ss.test, followUp)
    })
})

