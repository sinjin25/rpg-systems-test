import { ModNode } from "../../log2/index"

// ModNode.total is a closure over whatever aggregation fn (sumFunc, minFunc, ...) built it —
// that fn isn't retrievable from the node itself, so we can't reconstruct a "live" total()
// that recomputes from the cloned children. Trees are documented as not-to-be-mutated after
// construction (see newModNode's comment), so caching the resolved value at snapshot time is
// equivalent to the original for every real use.
const snapshotModNode = (node: ModNode): ModNode => {
    const cachedTotal = node.total()
    return {
        displayName: node.displayName,
        children: node.children.map(snapshotModNode),
        total: () => cachedTotal,
    }
}

export default snapshotModNode
