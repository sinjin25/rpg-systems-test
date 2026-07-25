import newModNode, { ModNode, Roller, leaf, avgFunc, mapFunc, rollNode } from './index.ts'

// The resolution layer sits ABOVE the value tree. The tree (modifier + roll) is pure and
// foldable; whether a roll HIT, and whether a trigger like Measured Strike fires, are decisions
// made out here in ordinary control flow (see DESIGN.md, "numbers in the tree, decisions
// outside"). A resolution produces a *sequence* of attempts - one per pass - each with its own
// immutable tree. Nothing is ever mutated; a retry rebuilds a fresh tree and reuses the first
// roll as a sealed constant.

export type Attempt = {
    attack: ModNode     // this pass's full tree: Modifier + Roll
    roll: ModNode       // this pass's Roll subtree, kept so a retry can average against it
    targetAC: number
    hit: boolean
}

// a d20 whose sides are a subtree, so an oversized-dice effect is just another child of Sides
// and shows up in the outline like any other contribution. rollNode resolves the die once and
// stores it as a constant, so the tree stays pure.
const d20 = (roller: Roller, name: string, sidesChildren: ModNode[] = [leaf('Base', 20)]): ModNode =>
    rollNode(name, newModNode('Sides', sidesChildren), roller)

// one pass: build the pure Attack tree, then make the hit/miss decision OUTSIDE it
const attempt = (roll: ModNode, modifier: ModNode, targetAC: number): Attempt => {
    const attack = newModNode('Attack', [modifier, newModNode('Roll', [roll])])
    return { attack, roll, targetAC, hit: attack.total() >= targetAC }
}

// Measured Strike: on a miss, reroll, average the original roll with the new one, and try again -
// exactly one retry. Returns the attempt sequence. The 'Measured Strike Average' node only exists
// when the trigger actually fired, so the tree is an honest record of what happened.
export const measuredStrike = (
    roller: Roller,
    modifier: ModNode,
    targetAC: number,
    sidesChildren: ModNode[] = [leaf('Base', 20)],
): Attempt[] => {
    const first = attempt(d20(roller, 'Natural Roll', sidesChildren), modifier, targetAC)
    if (first.hit) return [first]

    // fresh die - Sides is rebuilt, so any oversized-dice effect reapplies to the retry for free
    const second = d20(roller, 'Second Roll', sidesChildren)
    const averaged = newModNode('Measured Strike Average', [first.roll, second],
        mapFunc(Math.floor, avgFunc))
    return [first, attempt(averaged, modifier, targetAC)]
}

// the event log across attempts (the value-tree log per attempt is modNodeToText in format.ts)
export const renderAttempts = (attempts: Attempt[]): string =>
    attempts
        .map((a, i) => {
            const line = `Attempt ${i + 1}: Attack ${a.attack.total()} vs AC ${a.targetAC} -> ${a.hit ? 'HIT' : 'MISS'}`
            const trigger = !a.hit && i < attempts.length - 1 ? '\n  Measured Strike: reroll + average' : ''
            return line + trigger
        })
        .join('\n')
