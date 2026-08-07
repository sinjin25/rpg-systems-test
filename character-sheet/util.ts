import { ClassLevelMember, ClassLevelSheet } from "./class-level/type"

// fake a class for passing tests that don't care about levels
export const fakeCharacterLevels = (n: number): ClassLevelSheet => {
    return {
        base: {
            displayName: 'Test Class',
            level: n,
            data: Array.from({ length: n }, (): ClassLevelMember => ({
                attackBonus: 0,
                fortitudeSave: 0,
                reflexSave: 0,
                feats: {},
            })),
        },
    }
}
