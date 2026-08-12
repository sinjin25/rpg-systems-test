import { FightStartLog, TimeTravelContext } from "../types"

const fightStartToTT = (
    context: TimeTravelContext,
    log: {
        kind: 'fight-start'
    }
): FightStartLog => {
    const l = log as { kind: 'fight-start' }

    return {
        context,
        kind: l.kind,
    }
}

export default fightStartToTT
