import { standardFilters } from '../../feat/core-types'
import { Armor, BaseEquipment, Weapon } from '../index'
import roll from '../../roll/index.ts'

export const dagger: Weapon = {
    contexts: ['finesse', 'dagger', 'melee'],
    displayName: 'dagger',
    damage: () => roll(4)
}

export const shortsword: Weapon = {
    contexts: ['shortsword', 'melee'],
    displayName: 'shortsword',
    damage: () => roll(6),
}

export const daggerPlusOne: Weapon = {
    contexts: ['finesse'],
    displayName: 'test + 1',
    generateAdditionalContexts: {
        attack: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                whitelist: ['finesse'],
                blacklist: [],
            }),
            mod: () => {
                return 1
            }
        },
    },
    damage() {
        return roll(4) + 1
    }
}

export const RingPlusOneFinesseAttack: BaseEquipment = {
    displayName: 'ring plus one finesse attack',
    generateAdditionalContexts: {
        attack: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                whitelist: ['finesse'],
                blacklist: [],
            }),
            mod: () => {
                return 1
            }
        },
    },
    contexts: []
}
