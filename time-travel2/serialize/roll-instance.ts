import { createRoll } from "../../roll/index"
import { RollInstance } from "../../roll/types"

// a duplicate can be created using the number of rolls and the starting seed
const snapshotRollInstance = (ri: RollInstance): RollInstance => {
    const clone = createRoll(ri.getSeed())
    const totalRolls = ri._totalRolls()
    for (let i = 0; i < totalRolls; i++) clone.roll(2) // dummy — only the call count matters
    return clone
}

export default snapshotRollInstance
