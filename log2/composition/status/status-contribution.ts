import newModNode, { ModNode, sumFunc } from "../..";
import { CsScore, EveryTree, OwnerLog2, StatusBroadContexts, StatusInstanceLog2 } from "../../types";

type StackKind = NonNullable<StatusInstanceLog2['pointer']['stack']>['kind']

// for an instance, does it have a relevant broadContext? If not stop, otherwise gather the relevant ModNodes
const resolveInstanceNodes = (
    instances: StatusInstanceLog2[],
    owner: OwnerLog2,
    broadContext: EveryTree,
): ModNode[] => {
    const nodes: ModNode[] = []
    for (const instance of instances) {
        const handler = instance.pointer.broadContexts?.[broadContext]
        if (!handler) continue

        const node = handler(owner)
        if (!node) continue

        nodes.push(node)
    }
    return nodes
}

const highestNode = (nodes: ModNode[]): ModNode =>
    nodes.reduce((best, node) => (node.total() > best.total() ? node : best))
const combineByStackKind = (kind: StackKind, nodes: ModNode[]): ModNode[] => {
    if (kind === 'stack') return nodes
    return [highestNode(nodes)]
}

export const collectStatusContributions = (
    owner: OwnerLog2,
    broadContext: StatusBroadContexts | `${CsScore}-from-status`, // where people are getting their shit from
): ModNode[] => {
    const result: ModNode[] = []

    for (const instances of Object.values(owner.ss)) {
        if (!instances.length) continue

        const nodes = resolveInstanceNodes(instances, owner, broadContext)
        if (!nodes.length) continue

        const kind = instances[0]!.pointer.stack?.kind ?? 'highest'
        result.push(...combineByStackKind(kind, nodes))
    }

    return result
}

export default (broadContext: StatusBroadContexts) => (owner: OwnerLog2): ModNode => {
    const children = collectStatusContributions(owner, broadContext)

    return newModNode(
        broadContext,
        children,
        () => sumFunc(children)
    )
}