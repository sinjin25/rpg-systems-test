import { StatusEffect } from "../core-types"
import { InterceptRollFunction } from "../../roll-intercept"
import ModifierLog from "../../stat-modifier/log"

// the first natural 1 this fight becomes a natural 20, then the status consumes itself.
// key must match the fs key this status is granted under (see feat/feats/feint.ts)
export const feintStatus = (key: string): StatusEffect => {
    const interceptRoll: InterceptRollFunction = (attacker, target, sar) => {
        const naturalRoll = sar.attackLog.finalResult().roll
        if (naturalRoll !== 1) return sar

        const newLog = ModifierLog(sar.attackLog.displayName)
        sar.attackLog.groups.forEach(g => newLog.addModGroup(g.displayName, g))
        newLog.addRoll({ displayName: 'Feint', amount: 20 })

        delete attacker.owner.ss[key]

        return {
            ...sar,
            attackLog: newLog,
            attackRoll: newLog.finalResult().total,
        }
    }

    return {
        displayName: 'Feint',
        description: 'The first time you roll a natural 1 this fight, treat it as a natural 20 instead.',
        expiration: { kind: 'rounds-elapsed', remaining: Infinity },
        context: {},
        interceptRoll,
    }
}

export default feintStatus
