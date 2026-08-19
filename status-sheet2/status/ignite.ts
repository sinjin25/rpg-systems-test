// see ability-sheet2/abilities/ignite.ts

import { OwnerMaximal } from '../../actor2'
import newModNode, { leaf, sumFunc } from '../../log2'
import featContribution from '../../log2/composition/feat-contribution'
import roll from '../../roll'
import { makeWrapper } from '../instance'

const displayName = 'ignite'

const ignite = makeWrapper({
    displayName,
    broadContexts: {},
    tick: {
        calculateDamage: {
            base: () => newModNode(displayName, [leaf(`${displayName} 1d4`, roll(4))], sumFunc),
            mod: (source: OwnerMaximal) => featContribution('damage-over-time-feat-mod')(source),
        },
    },
})

export default ignite
