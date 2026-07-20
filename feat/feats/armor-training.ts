import { Feat, standardFilters } from "../core-types"

// Fighter's Armor Training: raises the maximum dexterity bonus worn armor allows
// toward AC. Contributes additively to the 'maxDex' broadcontext, which calculateAc
// folds into the armor's base allowance before clamping dex. Fixed at +1 for now -
// there is no ranked-feature system yet, so this does not scale on fighter level.
export const featArmorTraining: Feat = {
    displayName: 'Armor Training',
    context: {
        maxDex: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['all'],
            }),
            mod: (data) => {
                return 1
            },
        }
    }
}

export default featArmorTraining
