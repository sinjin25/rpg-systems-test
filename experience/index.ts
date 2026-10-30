import { OwnerMaximal } from '../actor2'
import { ModNode } from '../log2'
import { Experience, ExperienceBreakpoints } from './types'

export const experienceBreakpoints: ExperienceBreakpoints = [10, 50, 200, 400, 700, 1000, 9999999]

export const mutateCurrentExperience = (target: OwnerMaximal, amount: ModNode): {
    amount: ModNode,
    currentXp: number,
    didLevel: boolean,
} => {
    let breakpoints = [...experienceBreakpoints].reverse()
    let curr = target.experience.currentXp
    let nextBreakpoint: number = breakpoints[0]

    while (breakpoints.length) {
        const bp = breakpoints.pop()
        if (bp === undefined) break
        if (bp > curr) {
            nextBreakpoint = bp
            break
        }
    }

    target.experience.currentXp += amount.total()
    const didLevel = target.experience.currentXp >= nextBreakpoint

    return {
        amount,
        currentXp: target.experience.currentXp,
        didLevel,
    }
}

export const createDefaultExperience = (): Experience => {
    return {
        breakpoints: [...experienceBreakpoints],
        currentXp: 0,
    }
}