import { standardFilters } from '../../../feat/feats/index.ts'
import { BaseEquipment } from '../../../equipment-sheet/index.ts'

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
        damage: {
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
