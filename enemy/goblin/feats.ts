import { Feat, standardFilters } from "../../feat/core-types";

export const ambush: Feat = {
    displayName: 'Ambush!',
    description: `Goblins are fast and know how to take an opponent by surprise. This might catch you flat-footed!\n\n+4 initiative`,
    context: {
        initiative: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                blacklist: [],
                whitelist: ['all'],
            }),
            mod: (data = {}) => {
                return 4
            }
        }
    }
}