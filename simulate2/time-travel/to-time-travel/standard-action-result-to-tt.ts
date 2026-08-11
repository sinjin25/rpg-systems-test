import { FinalStandardActionResult } from "../../../actor2/act"
import freezeModNodeRecursive from "../snapshot/mod-node"
import { FrozenStandardActionResult, SARLog, TimeTravelContext } from "../types"

// alternative would be verifying each key looped through was actually of type ModNode
const MOD_NODE_KEYS = ['attackResult', 'damageResult', 'threatResult',
    'critConfirmResult', 'critDamageResult'] as const

const standardActionResultToTT = (
    context: TimeTravelContext,
    log: {
        kind: 'standard-action-result'
    }
): SARLog => {
    const l = log as FinalStandardActionResult & { kind: 'standard-action-result' }

    const modNodes: FrozenStandardActionResult = {}
    if (l.relevantSlot) modNodes.relevantSlot = {
        // lazy ass reference
        ...l.relevantSlot
    }

    for (const key of MOD_NODE_KEYS) {
        const node = l[key]
        if (node) modNodes[key] = freezeModNodeRecursive(node)
    }

    return {
        context,
        kind: l.kind,
        modNodes,
    }
}

export default standardActionResultToTT
