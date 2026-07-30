import roll from "../roll"

// a node with 0 to many children
// .total() is a source of truth for all parent nodes
export type ModNode = {
    displayName: string,
    total: () => number,
    children: ModNode[],
}

// a function which takes the children of a node and returns a value (or just returns a constant for a leaf)
export type TotalFunc = (children: ModNode[]) => number

// note: sumFunc returns 0 not undefined for no children
export const sumFunc: TotalFunc = (children) =>
    children.reduce((acc, c) => acc + c.total(), 0)

// a leaf's .total()
export const constantFunc = (amount: number): TotalFunc => () => amount

export const mapFunc = (f: (folded: number) => number, inner: TotalFunc = sumFunc): TotalFunc =>
    (children) => f(inner(children))

const towardZero = (val: number) => val >= 0 ? Math.floor(val) : Math.ceil(val)

// stat modifiers are summed in modifier space (a +1 raw stat shows as +0.5) and
// then rounded once, here, at the node that owns the rounding
export const statSumFunc: TotalFunc = mapFunc(towardZero)

// allow min/maxes to not accidentally pass infinity
const requireChildren = (children: ModNode[], rule: string) => {
    if (!children.length) throw Error(`${rule} node needs at least one child to have a total`)
}

export const minFunc: TotalFunc = (children) => {
    requireChildren(children, 'min')
    return Math.min(...children.map(c => c.total()))
}

export const maxFunc: TotalFunc = (children) => {
    requireChildren(children, 'max')
    return Math.max(...children.map(c => c.total()))
}

export const avgFunc: TotalFunc = (children) => {
    requireChildren(children, 'average')
    return sumFunc(children) / children.length
}

export const productFunc: TotalFunc = (children) => {
    requireChildren(children, 'product')
    return children.reduce((acc, c) => acc * c.total(), 1)
}

export const newModNode = (
    displayName: string,
    children: ModNode[] = [],
    totalFunc: TotalFunc | number = sumFunc,
): ModNode => {
    const node: ModNode = {
        displayName,
        children,
        // if children is mutated, total will remain accurate
        // however don't fucking modify a tree
        total: typeof totalFunc === 'number' ? () => totalFunc : () => totalFunc(node.children),
    }
    return node
}

export const leaf = (displayName: string, amount: number): ModNode =>
    newModNode(displayName, [], constantFunc(amount))

/* export type Roller = (sides: number) => number */

// options for findNodeMatching. Partial at the call site - any key left out uses the default below,
// so `findNodeMatching(node, /dex/i)` just works.
export type MatchNodeOptions = {
    // how many child levels below the root to descend. 0 = the root node only; 1 = root + its direct
    // children; Infinity = the whole subtree. Default: Infinity.
    depth: number,
    // whether the root's own displayName is eligible to match (vs only its descendants). Default: true.
    includeRoot: boolean,
    // when `pattern` is a string, compile it case-insensitively. Ignored when `pattern` is already a
    // RegExp (put the flags on the RegExp yourself). Default: true.
    caseInsensitive: boolean,
}

const DEFAULT_MATCH_OPTIONS: MatchNodeOptions = {
    depth: Infinity,
    includeRoot: true,
    caseInsensitive: true,
}

const findWithin = (node: ModNode, re: RegExp, depth: number, includeRoot: boolean): ModNode | undefined => {
    if (includeRoot && re.test(node.displayName)) return node
    if (depth <= 0) return undefined
    for (const c of node.children) {
        const hit = findWithin(c, re, depth - 1, true)
        if (hit) return hit
    }
    return undefined
}

// The first node (depth-first, root before children) whose displayName matches `pattern`, searching
// `node` and its descendants within `depth` levels - or undefined if none. Lets a test confirm a tree
// *considered* something - e.g. that effective-attack-stat used dex, not str - and inspect that node's
// total, without rendering the outline first. Undefined is falsy and a node is truthy, so a plain
// existence check still reads naturally. `g`/`y` flags are stripped so repeated .test() calls stay
// stateless.
export const findNodeMatching = (
    node: ModNode,
    pattern: RegExp | string,
    options: Partial<MatchNodeOptions> = {},
): ModNode | undefined => {
    const { depth, includeRoot, caseInsensitive } = { ...DEFAULT_MATCH_OPTIONS, ...options }
    const re = pattern instanceof RegExp
        ? new RegExp(pattern.source, pattern.flags.replace(/[gy]/g, ''))
        : new RegExp(pattern, caseInsensitive ? 'i' : '')
    return findWithin(node, re, depth, includeRoot)
}

export default newModNode
