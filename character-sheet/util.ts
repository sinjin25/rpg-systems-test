import { ClassLevelPickLog } from "../class-level2/types"

export const fakeCharacterLevels = (n: number): ClassLevelPickLog => {
    const result: ClassLevelPickLog = []
    for (let i = 0; i < n; i++) {
        result.push({
            key: 'fighter',
            freeFeats: [],
        })
    }
    return result
}
