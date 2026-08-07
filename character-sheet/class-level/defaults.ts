import type { ClassLevelMember, ClassLevelSheet } from "./type"

// fake a class for passing tests that don't care about this
// lives here rather than in ./index so that character-sheet can build its default
// sheets without pulling in ability-sheet2/actor2 at module-eval time
export const characterLevels = (n: number): ClassLevelSheet => {
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
