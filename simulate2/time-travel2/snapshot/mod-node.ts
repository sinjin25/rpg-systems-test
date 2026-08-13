import { FrozenModNode } from "../types"
import type { ModNode } from "../../../log2"

const freezeModNodeRecursive = (root: ModNode): FrozenModNode => ({
    displayName: root.displayName,
    total: root.total(),
    children: root.children.map(freezeModNodeRecursive),
})

export default freezeModNodeRecursive
