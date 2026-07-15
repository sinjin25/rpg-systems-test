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

export type ModGroup = ModResult & {
    displayName: string,
}

export type FinalModLogResult = {
    modifier: number,
    roll: number,
    total: number,
}

export type ModLog = {
    displayName: string,
    roll: ModLogMember[],
    mods: ModLogMember[],
    groups: ModGroup[],
    addRoll: (d: ModLogMember) => ModLogMember[],
    addMod: (d: ModLogMember) => ModLogMember[],
    // a member belongs to either addMod or addModGroup, never both
    addModGroup: (displayName: string, res: ModResult) => ModGroup[],
    finalResult: () => FinalModLogResult,
}

// wraps a single-source amount (e.g. a base stat mod) into a ModResult
export const namedMod = (displayName: string, amount: number): ModResult => ({
    total: amount,
    entries: [{ displayName, amount }],
})

export const util_findModLogGroupItem = (
    logAggregator: {
        groups: ModGroup[],
    },
    query: { groupName: string, modDisplayName: string }
) => {
    if (!query.groupName || !query.modDisplayName) throw Error('did not pass either a query.groupName or query.modDisplayName')
    const group = logAggregator.groups.find(a => a.displayName === query.groupName)
    if (!group) return undefined
    const member = group.entries.find(a => a.displayName === query.modDisplayName)
    return member
}

const ModifierLog = (displayName: string): ModLog => {
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
        addModGroup(displayName: string, res: ModResult) {
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
