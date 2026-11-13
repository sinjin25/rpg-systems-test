import { Feat2 } from "../types";

export const displayName = 'Tower Shield Proficiency'
export const featTowerShieldProficiency = {
    id: 'towerShieldProficiency',
    hidden: false,
    displayName,
    description: 'You can use tower shields',
    broadContexts: {},
} as const satisfies Feat2

export default featTowerShieldProficiency