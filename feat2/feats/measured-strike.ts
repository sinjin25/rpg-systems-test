import { leaf } from "../../log2";
import { Feat2 } from "..";
import { InterceptRollFunction } from "../../roll-intercept";

// on a miss, reroll and use the average of the original roll and the reroll instead
const measuredStrikeIntercept: InterceptRollFunction = (attacker, target, sar) => {
    throw Error('Measured strike in feat2 probably doesnt work')
    const targetAc = calculateAc(target.owner).total
    const naturalRoll = sar.attackLog.finalResult().roll

    if (attackHits(sar.attackRoll, targetAc, naturalRoll)) return sar

    // this is only used to average so nat 20, nat 1 rules do not apply
    // we round down here
    const reroll = roll(20)
    const averagedRoll = Math.floor((naturalRoll + reroll) / 2)

    const newLog = ModifierLog(sar.attackLog.displayName)
    sar.attackLog.groups.forEach(g => newLog.addModGroup(g.displayName, g))
    newLog.addRoll({ displayName: 'measured strike (average 2d20)', amount: averagedRoll })

    return {
        ...sar,
        attackLog: newLog,
        attackRoll: newLog.finalResult().total,
    }
}

const displayName = 'Measured Strike'
export default {
    displayName,
    broadContexts: {},
    description: 'On a miss, reroll the attack and use the average of the original roll and the reroll.',
    interceptRoll: measuredStrikeIntercept,
} as Feat2