import { ModLog, ModLogMember } from "./index"

const formatAmount = (amount: number) => amount >= 0 ? `+${amount}` : `${amount}`

const memberLines = (member: ModLogMember, indent: string): string[] => {
    const lines = [`${indent}${member.displayName}, ${formatAmount(member.amount)}`]
    for (const d of member.detail ?? []) {
        lines.push(...memberLines(d, indent + '  '))
    }
    return lines
}

// renders one ModLog as a human-readable, indented outline - roll type, its final
// roll/total, then each group with its per-source entries - for eyeballing a full
// calculation (e.g. an act() result's attackLog/damageLog/critRangeLog/...) without
// having to step through it in a debugger
export const modLogToText = (log: ModLog): string => {
    const final = log.finalResult()
    const lines = [log.displayName]

    if (log.roll.length) lines.push(`  roll: ${final.roll}`)
    lines.push(`  total: ${final.total}`)

    for (const group of log.groups) {
        lines.push(`  ${group.displayName}`)
        for (const entry of group.entries) {
            lines.push(...memberLines(entry, '    '))
        }
    }

    return lines.join('\n')
}

// same as modLogToText, but for every log belonging to one action (attack, confirm,
// damage, crit range, crit multiplier, ...) so the whole calculation prints as one block
export const modLogsToText = (logs: ModLog[]): string => logs.map(modLogToText).join('\n\n')

export type PlainModLog = {
    displayName: string,
    roll: number,
    modifier: number,
    total: number,
    groups: Array<{ displayName: string, total: number, entries: ModLogMember[] }>,
}

// strips the functions off a ModLog so it can be JSON.stringify'd directly - the same
// data as modLogToText, just as plain data instead of an outline string
export const toPlainModLog = (log: ModLog): PlainModLog => {
    const final = log.finalResult()
    return {
        displayName: log.displayName,
        roll: final.roll,
        modifier: final.modifier,
        total: final.total,
        groups: log.groups,
    }
}

export const toPlainModLogs = (logs: ModLog[]): PlainModLog[] => logs.map(toPlainModLog)
