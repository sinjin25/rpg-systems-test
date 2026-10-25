import { Feat2 } from "..";

// see proficient-in-equipment.ts
export const displayName = 'Martial Proficiency'
export const featMartialProficiency = {
    displayName,
    description: 'You can use martial weapons like longswords without a -4 attack penalty.',
    broadContexts: {},
} as const satisfies Feat2

export default featMartialProficiency