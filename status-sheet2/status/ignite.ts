// see ability-sheet2/abilities/ignite.ts

import { OwnerMaximal } from '../../actor2'
import newModNode, { leaf, sumFunc } from '../../log2'
import roll from '../../log2/roll'
import { damageOverTime } from '../../log2/terminal'
import damageOverTimeTaken from '../../log2/terminal-composition/damage-over-time-taken'
import { SnapshotStatusEffect } from '../types'

const displayName = 'ignite'
const ignite: SnapshotStatusEffect = (data: {
    snapshot: OwnerMaximal,
}) => {
    return {
        displayName,
        broadContexts: {},
        tick: {
            calculateDamage: (receiver: OwnerMaximal) => {
                const base = newModNode(displayName, [
                    roll(4, 1)(data.snapshot),
                ], sumFunc)

                const dot = damageOverTime(base)(data.snapshot)

                return damageOverTimeTaken({
                    node: dot,
                })(receiver)
            }
        },
    }
}

export default ignite