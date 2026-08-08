import { ClassLevelPickLog } from "../class-level2/types"

// fake a class for passing tests that don't care about levels: n fighter levels
export const fakeCharacterLevels = (n: number): ClassLevelPickLog =>
    Array.from({ length: n }, () => ({
        key: 'fighter',
        freeFeats: [],
    }))
