// works for ModNode or FrozenModNode
type FormattableNode = {
    displayName: string,
    total: number | (() => number),
    children: FormattableNode[],
}

const totalOf = (node: FormattableNode): number =>
    typeof node.total === 'function' ? node.total() : node.total

// eyeball a calculation by rendering tree as indented text
export const modNodeToText = (node: FormattableNode, indent = ''): string => {
    /* console.log('looking at', node) */
    const lines = [`${indent}${node.displayName} ${totalOf(node)}`]
    for (const child of node.children) {
        lines.push(...modNodeToText(child, indent + '    ').split('\n'))
    }
    return lines.join('\n')
}

export default modNodeToText
