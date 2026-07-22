// for debug and player information
// the owner keeps the context and should group appropriately
export type ModLogMember = {
    amount: number,
    displayName: string,
    // informational nested breakdown (e.g. stat bonuses feeding a halved modifier); never summed
    detail?: ModLogMember[],
}

// the standard return shape of every calculateX-type function
export type ModResult = {
    total: number,
    entries: ModLogMember[],
}

// all this does is nail down the possibilities for what strings might exist, giving autocomplete
// in exchange, you do have (should) to define G on a per calculator basis
export type ModGroup<G extends string = string> = ModResult & {
    displayName: G,
}

export type FinalModLogResult = {
    modifier: number,
    roll: number,
    total: number,
}

export type ModLog<G extends string = string> = {
    displayName: string,
    roll: ModLogMember[],
    mods: ModLogMember[],
    // .find(a=> a.displayName) has autocomplete
    groups: ModGroup<G>[],
    addRoll: (d: ModLogMember) => ModLogMember[],
    addMod: (d: ModLogMember) => ModLogMember[],
    // a member belongs to either addMod or addModGroup, never both
    addModGroup: (displayName: G, res: ModResult) => ModGroup<G>[],
    finalResult: () => FinalModLogResult,
}

// wraps a single-source amount (e.g. a base stat mod) into a ModResult
export const namedMod = (displayName: string, amount: number): ModResult => ({
    total: amount,
    entries: [{ displayName, amount }],
})

export const util_findModLogGroupItem = <G extends string>(
    logAggregator: {
        groups: ModGroup<G>[],
    },
    // NoInfer matters: without it G would also infer from groupName, widening to AcGroup | 'typo' and quietly accepting a bad name instead of erroring
    query: { groupName: NoInfer<G>, modDisplayName: string }
) => {
    if (!query.groupName || !query.modDisplayName) throw Error('did not pass either a query.groupName or query.modDisplayName')
    const group = logAggregator.groups.find(a => a.displayName === query.groupName)
    if (!group) return undefined
    const member = group.entries.find(a => a.displayName === query.modDisplayName)
    return member
}

const ModifierLog = <G extends string = string>(displayName: string): ModLog<G> => {
    return {
        displayName,
        roll: [],
        mods: [],
        groups: [],
        addRoll(d: ModLogMember) {
            this.roll.push(d)
            return this.roll
        },
        addMod(d: ModLogMember) {
            this.mods.push(d)
            return this.mods
        },
        addModGroup(displayName: G, res: ModResult) {
            this.groups.push({ displayName, ...res })
            this.mods.push(...res.entries)
            return this.groups
        },
        finalResult() {
            const modRed = this.mods.reduce((acc, mod) => {
                return acc + mod.amount
            }, 0)
            const rollRed = this.roll.reduce((acc, mod) => {
                return acc + mod.amount
            }, 0)

            return {
                modifier: modRed,
                roll: rollRed,
                total: rollRed + modRed
            }
        }
    }
}

export default ModifierLog
