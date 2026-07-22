import roll from "../../roll"

// A mod is a node in a tree. Every node looks the same - a name, a total, and the
// children that explain it - but each node owns *how* its total derives from those
// children. Usually that is a sum; sometimes it is a min (an armor dex cap), a max
// (weapon finesse picking the better stat), an average, a transform (a stat
// converted to a modifier), or a die roll parameterised by a child.
//
// total() is the source of truth. children are the explanation.

export type ModNode = {
    displayName: string,
    total: () => number,
    children: ModNode[],
}

// how a node folds its children into its own total
export type TotalFunc = (children: ModNode[]) => number

export const sumFunc: TotalFunc = (children) =>
    children.reduce((acc, c) => acc + c.total(), 0)

// a leaf: the amount is the node, children are ignored
export const constantFunc = (amount: number): TotalFunc => () => amount

// applies a transform to whatever the children fold to. this is how a node that has
// a *relationship* to its children rather than a sum of them is expressed - a stat
// converted to a modifier, damage doubled by a crit - without reaching into children
// by index
export const mapFunc = (f: (folded: number) => number, inner: TotalFunc = sumFunc): TotalFunc =>
    (children) => f(inner(children))

// pathfinder halves round toward zero, not down - see halveMod in stat-modifier/index.ts.
// -5.5 becomes -5, matching how a negative stat modifier behaves
const towardZero = (val: number) => val >= 0 ? Math.floor(val) : Math.ceil(val)

// stat modifiers are summed in modifier space (a +1 raw stat shows as +0.5) and
// then rounded once, here, at the node that owns the rounding
export const statSumFunc: TotalFunc = mapFunc(towardZero)

// an empty min/max/average is a construction bug, not a zero - Math.min() of nothing
// is Infinity, which would silently poison every ancestor
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

// a crit is its multiplier times the damage that scales with it. modelling the
// multiplier as a *child* rather than a captured transform keeps it visible in the
// outline and lets it grow its own subtree - and multiplication commutes, so unlike
// a positional rule this does not care what order the children are in
export const productFunc: TotalFunc = (children) => {
    requireChildren(children, 'product')
    return children.reduce((acc, c) => acc * c.total(), 1)
}

export const newModNode = (
    displayName: string,
    children: ModNode[] = [],
    totalFunc: TotalFunc = sumFunc,
): ModNode => {
    const node: ModNode = {
        displayName,
        children,
        // reads node.children rather than the captured argument so a tree stays
        // correct if children are pushed after construction
        total: () => totalFunc(node.children),
    }
    return node
}

// convenience for the most common node: a named flat amount with nothing under it
export const leaf = (displayName: string, amount: number): ModNode =>
    newModNode(displayName, [], constantFunc(amount))

export type Roller = (sides: number) => number

// A die. Its rule really is `roll(sides)`, where sides is its own subtree - so
// anything that grows the die (an oversized-dice effect) is just another child of
// sides, and shows up in the outline like every other contribution.
//
// The roll is resolved once, here, and stored. total() is lazy everywhere else, and
// a die whose total() rerolled on every read would report a different number to
// every caller that looked at it.
export const rollNode = (
    displayName: string,
    sides: ModNode,
    roller: Roller = roll,
): ModNode => {
    const rolled = roller(sides.total())
    // sides is the only child: it is the input to the roll, not a term in it
    return newModNode(displayName, [sides], constantFunc(rolled))
}

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
