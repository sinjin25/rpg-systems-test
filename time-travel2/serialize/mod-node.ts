import { ModNode } from "../../log2/index"
import { FrozenModNode } from "../types"

const serializeModNode = (node: ModNode): FrozenModNode => {
    const cachedTotal = node.total()
    return {
        displayName: node.displayName,
        children: node.children.map(serializeModNode),
        total: cachedTotal,
    }
}

export const deserializeModNode = (node: FrozenModNode): ModNode => ({
    displayName: node.displayName,
    total: () => node.total,
    children: node.children.map(deserializeModNode),
})

export default serializeModNode
