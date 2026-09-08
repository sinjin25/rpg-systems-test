import { Handlers } from "./types"
import freezeModNodeRecursive from "./snapshot/mod-node"
import { FrozenStandardActionResult } from "./types"

const MOD_NODE_KEYS = ['attackResult', 'damageResult', 'threatResult',
    'critConfirmResult', 'critDamageResult', 'damageTakenResult'] as const

const standardActionResult: Handlers['standard-action-result'] = (input) => {
    const { source, to, ...sar } = input

    const modNodes: FrozenStandardActionResult = {}
    if (sar.relevantSlot) modNodes.relevantSlot = { ...sar.relevantSlot }

    for (const key of MOD_NODE_KEYS) {
        const node = sar[key]
        if (node) modNodes[key] = freezeModNodeRecursive(node)
    }

    return { source, to, kind: 'standard-action-result', modNodes }
}

export default standardActionResult
