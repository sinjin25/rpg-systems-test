import type { Actor } from "../character/actor"

export const applyHeal = (
    health: Actor['health'],
    amount: number,
): void => {
    const heal = Math.max(0, amount)
    health.curr = Math.min(health.max, health.curr + heal)
}

export default applyHeal
