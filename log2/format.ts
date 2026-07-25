import { ModNode } from "./index"

// renders a node and everything under it as an indented outline, so a calculation
// can be eyeballed against a hand-written expectation (see scratch.txt)
export const modNodeToText = (node: ModNode, indent = ''): string => {
    const lines = [`${indent}${node.displayName} ${node.total()}`]
    for (const child of node.children) {
        lines.push(...modNodeToText(child, indent + '    ').split('\n'))
    }
    return lines.join('\n')
}

export default modNodeToText
