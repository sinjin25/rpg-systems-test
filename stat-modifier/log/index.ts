// for debug and player information
// the owner keeps the context and should group appropriately
export type ModLogMember = {
    amount: number,
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
    addRoll: (d: ModLogMember) => ModLogMember[],
    addMod: (d: ModLogMember) => ModLogMember[],
    finalResult: () => FinalModLogResult,
}

const ModifierLog = (displayName: string): ModLog => {
    return {
        displayName,
        roll: [],
        mods: [],
        addRoll(d: ModLogMember) {
            this.roll.push(d)
            return this.roll
        },
        addMod(d: ModLogMember) {
            this.mods.push(d)
            return this.mods
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