import { DecaySaveSucceededLog } from "../../../status-sheet2/types"
import { TimeTravelContext } from "../types"

const decaySaveSucceededToTT = (
    context: TimeTravelContext,
    kind: DecaySaveSucceededLog,
) => {
    return {
        context,
        kind,
    }
}

export default decaySaveSucceededToTT