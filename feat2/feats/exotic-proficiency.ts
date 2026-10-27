import { Feat2 } from "../types";

// see proficient-in-equipment.ts
export const displayName = 'Exotic Proficiency'
export const featExoticProficiency = {
    displayName,
    description: 'You can use exotic weapons like dueling swords without a -4 attack penalty.',
    broadContexts: {},
} as const satisfies Feat2

export default featExoticProficiency