import { Feat2 } from "../types";

export const displayName = 'Shield Proficiency'
export const featShieldProficiency = {
    id: 'shieldProficiency',
    hidden: false,
    displayName,
    description: 'You can use shields (but not tower shields)',
    broadContexts: {},
} as const satisfies Feat2

export default featShieldProficiency