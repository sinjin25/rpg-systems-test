import { FeatModRequiredData, standardFilters } from "../../feat/core-types"
import { calculateModifier } from "../../stat-modifier"
import { StatusEffect } from "../core-types"

export const blessStatus: StatusEffect = {
    displayName: 'Bless',
    description: 'This creature has been blessed and gets +2 to attack rolls',
    expiration: {
        kind: 'actions-elapsed',
        remaining: 100, // make this variable in the future
    },
    context: {
        attack: {
            applies(activeContexts = []) {
                return true
            },
            mod(data = {}) {
                return 2
            }
        },
    }
}

export default blessStatus