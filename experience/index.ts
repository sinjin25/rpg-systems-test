import { OwnerMaximal } from '../actor2'
import { leaf, ModNode } from '../log2'
import { Experience, ExperienceBreakpoints } from './types'

export const experienceBreakpoints: ExperienceBreakpoints = [50, 150, 300, 600, 1000, 1500, 9999999]

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
        baseOnKill: leaf('base-xp-on-kill', 2),
        breakpoints: [...experienceBreakpoints],
        currentXp: 0,
    }
}