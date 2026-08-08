import { ModNode } from "./index"

// eyeball a calculation by rendering tree as indented text
export const modNodeToText = (node: ModNode, indent = ''): string => {
    /* console.log('looking at', node) */
    const lines = [`${indent}${node.displayName} ${node.total()}`]
    for (const child of node.children) {
        lines.push(...modNodeToText(child, indent + '    ').split('\n'))
    }
    return lines.join('\n')
}

export default modNodeToText
