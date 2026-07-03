import { standardFilters } from '../../../feat/feats/index.ts'
import { Weapon } from '../../../equipment-sheet/index.ts'
import roll from '../../../roll/index.ts'

export const dagger: Weapon = {
    contexts: ['finesse', 'dagger', 'melee'],
    displayName: 'dagger',
    damage: () => roll(4)
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
